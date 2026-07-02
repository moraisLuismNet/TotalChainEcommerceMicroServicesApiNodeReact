import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const internalAuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, data: null, message: "No token provided", errors: ["Internal authentication required"] });
    return;
  }
  const token = authHeader.split(" ")[1];
  if (token === process.env.JWT_KEY) {
    next();
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY || "default-key");
    next();
  } catch (error) {
    res.status(401).json({ success: false, data: null, message: "Invalid internal token", errors: ["Internal authentication failed"] });
  }
};
