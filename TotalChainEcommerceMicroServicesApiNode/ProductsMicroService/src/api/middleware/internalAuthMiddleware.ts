import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

export function internalAuthMiddleware(roles: string | string[] = []): RequestHandler {
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "No authentication token provided" });
      }
      const token = authHeader.split(" ")[1];
      if (token === process.env.JWT_KEY) {
        req.user = { email: "internal@service", name: "Internal Service", role: "Admin", iat: Math.floor(Date.now() / 1000) };
        next();
        return;
      }
      if (!process.env.JWT_KEY) {
        return res.status(500).json({ success: false, message: "Server configuration error" });
      }
      const decoded = jwt.verify(token, process.env.JWT_KEY) as any;
      req.user = decoded;
      if (roleArray.length > 0 && !roleArray.includes(decoded.role)) {
        return res.status(403).json({ success: false, message: "Forbidden: Insufficient permissions" });
      }
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
  };
}
export default internalAuthMiddleware;
