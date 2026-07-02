import bcrypt from "bcryptjs";
import { UserRepository } from "../database/repositories/UserRepository";
import { JwtService } from "./jwtService";
import { LoginDTO } from "../core/dtos/Auth/LoginDTO";
import { RegisterDTO } from "../core/dtos/Auth/RegisterDTO";
import { ChangePasswordDTO } from "../core/dtos/Auth/ChangePasswordDTO";
import { AuthResponseDTO } from "../core/dtos/Auth/AuthResponseDTO";
import { IAuthService } from "./interfaces/IAuthService";

export class AuthService implements IAuthService {
  private repository: UserRepository;
  private jwtService: JwtService;

  constructor() {
    this.repository = new UserRepository();
    this.jwtService = new JwtService();
  }

  async loginAsync(dto: LoginDTO): Promise<AuthResponseDTO> {
    const user = await this.repository.getByEmailAsync(dto.email);
    if (!user) throw new Error("Invalid email or password");

    const isValid = bcrypt.compareSync(dto.password, user.Password);
    if (!isValid) throw new Error("Invalid email or password");

    const token = this.jwtService.generateToken(user.Email, user.Name, user.Role);
    return { email: user.Email, name: user.Name, role: user.Role, token };
  }

  async registerAsync(dto: RegisterDTO): Promise<AuthResponseDTO> {
    const existing = await this.repository.getByEmailAsync(dto.email);
    if (existing) throw new Error("Email already registered");

    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(dto.password, salt);

    const user = await this.repository.create({
      Email: dto.email,
      Name: dto.name,
      Password: hashed,
      Salt: salt,
      Role: dto.role || "User",
      Address: dto.address,
      PhoneNumber: dto.phoneNumber,
    });

    const token = this.jwtService.generateToken(user.Email, user.Name, user.Role);
    return { email: user.Email, name: user.Name, role: user.Role, token };
  }

  async changePasswordAsync(dto: ChangePasswordDTO): Promise<void> {
    const user = await this.repository.getByEmailAsync(dto.email);
    if (!user) throw new Error("User not found");

    const isValid = bcrypt.compareSync(dto.currentPassword, user.Password);
    if (!isValid) throw new Error("Current password is incorrect");

    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(dto.newPassword, salt);

    await this.repository.update(dto.email, { Password: hashed, Salt: salt } as any);
  }
}
