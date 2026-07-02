import jwt from "jsonwebtoken";
import { IJwtService } from "./interfaces/IJwtService";

export class JwtService implements IJwtService {
  generateToken(email: string, name: string, role: string): string {
    const jwtKey = process.env.JWT_KEY || "";
    return jwt.sign({ email, name, role }, jwtKey, { expiresIn: "24h" });
  }
}
