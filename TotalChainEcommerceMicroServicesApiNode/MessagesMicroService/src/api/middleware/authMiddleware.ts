import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, data: null, message: "No token provided", errors: ["Authentication required"] });
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY || "default-key");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, data: null, message: "Invalid token", errors: ["Authentication failed"] });
  }
};
