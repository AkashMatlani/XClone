import { getAuth } from "@clerk/express";
export const protectRoute = (req, res, next) => {
    console.log("Auth object:", getAuth(req));

  const { userId } = getAuth(req);
  
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized - you must be logged in" });
  }
  
  next();
};