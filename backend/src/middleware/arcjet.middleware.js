import aj from "../config/arcjet.js";
import { getAuth } from "@clerk/express";

export const arcjetMiddleware = async (req, res, next) => {
  try {
    // Skip Arcjet for authenticated users
    const { userId } = getAuth(req);
    if (userId) {
      console.log("✅ Authenticated user - skipping Arcjet");
      return next();
    }

    if (!aj) {
      console.warn("⚠️ Arcjet client not initialized!");
      return next();
    }

    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          error: "Too many requests",
          message: "Rate limit exceeded. Try again later.",
        });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({
          error: "Bot access denied",
          message: "Automated requests are not allowed.",
        });
      } else {
        return res.status(403).json({
          error: "Forbidden",
          message: "Access denied by security policy.",
        });
      }
    }

    // Spoofed bot detection
    const spoofed = decision.results.some(
      (r) => r.reason.isBot() && r.reason.isSpoofed()
    );
    if (spoofed) {
      return res.status(403).json({
        error: "Spoofed bot detected",
        message: "Malicious bot activity detected.",
      });
    }

    next();
  } catch (err) {
    console.error("⚠️ Arcjet middleware error:", err);
    next(); 
  }
};