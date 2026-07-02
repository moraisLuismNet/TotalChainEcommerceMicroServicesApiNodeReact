import { LoginDTO } from "../../core/dtos/Auth/LoginDTO";
import { RegisterDTO } from "../../core/dtos/Auth/RegisterDTO";
import { ChangePasswordDTO } from "../../core/dtos/Auth/ChangePasswordDTO";
import { AuthResponseDTO } from "../../core/dtos/Auth/AuthResponseDTO";

export interface IAuthService {
  loginAsync(dto: LoginDTO): Promise<AuthResponseDTO>;
  registerAsync(dto: RegisterDTO): Promise<AuthResponseDTO>;
  changePasswordAsync(dto: ChangePasswordDTO): Promise<void>;
}
