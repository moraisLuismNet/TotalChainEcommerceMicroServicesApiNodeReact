import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ResponseHelper } from '../../core/helpers/ResponseHelper';

interface JwtPayload {
  email?: string;
  role?: string;
  [key: string]: any;
}
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      userEmail?: string;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ResponseHelper.unauthorized(res, 'No token provided');
    return;
  }
  const token = authHeader.split(' ')[1];
  const jwtKey = process.env.JWT_KEY || '';
  try {
    const decoded = jwt.verify(token, jwtKey) as JwtPayload;
    req.user = decoded;
    req.userEmail = decoded.email || decoded.sub as string || '';
    next();
  } catch {
    ResponseHelper.unauthorized(res, 'Invalid or expired token');
  }
}

export function adminMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.user?.role !== 'Admin') {
    ResponseHelper.forbidden(res, 'Admin access required');
    return;
  }
  next();
}
