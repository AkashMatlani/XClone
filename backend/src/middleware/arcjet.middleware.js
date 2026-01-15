import { aj } from "../config/arcjet.js";

//arcjet middleware for rate limiting, bot protection and security

export const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1,
    });

    //handle denined requests

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          error: "Too many request",
          message: "Rate Limit exceeded. Please try again later.",
        });
      } else if (decision.reason.isBot()) {
        res.status(403).json({
          error: "Bot access denied",
          message: "Automated requests are not allowed.",
        });
      } else {
        res.status(403).json({
          error: "Forbidden",
          message: "Access denined by security policy.",
        });
      }
    }

    //check for spoofed bots

    if (
      decision.results.some(
        (result) => result.reason.isBot() && result.reason.isSpoofed()
      )
    ) {
      return res.status(403).json({
        error: "Spoofed bot detected",
        message: "Malicious bot activity detected.",
      });

      next();
    }
  } catch (error) {
    console.error("Arcjet middleware error:", error);
    //allow request to continue if Arcjet fails
    next();
  }
};
