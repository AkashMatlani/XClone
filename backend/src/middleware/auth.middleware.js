import { getAuth } from "@clerk/express";
export const protectRoute = (req, res, next) => {
  const auth = getAuth(req);
  console.log("Auth object:", auth);

  const { userId } = getAuth(req);
  
  if (!auth?.userId) {
    return res.status(401).json({ message: "Unauthorized - you must be logged in" });
  }
    req.auth = auth; //attach for controllers
  next();
};