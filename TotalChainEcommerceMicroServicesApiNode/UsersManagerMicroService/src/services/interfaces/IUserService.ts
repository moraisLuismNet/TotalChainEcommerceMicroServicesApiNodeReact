import { UserDTO } from "../../core/dtos/User/UserDTO";
import { CreateUserDTO } from "../../core/dtos/User/CreateUserDTO";
import { UpdateUserDTO } from "../../core/dtos/User/UpdateUserDTO";

export interface IUserService {
  getAllAsync(): Promise<UserDTO[]>;
  getByIdAsync(email: string): Promise<UserDTO | null>;
  createAsync(dto: CreateUserDTO): Promise<UserDTO>;
  updateAsync(email: string, dto: UpdateUserDTO): Promise<UserDTO>;
  deleteAsync(email: string): Promise<boolean>;
}
