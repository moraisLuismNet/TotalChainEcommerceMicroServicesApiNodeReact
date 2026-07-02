export interface IJwtService {
  generateToken(email: string, name: string, role: string): string;
}
