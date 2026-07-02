import bcrypt from "bcryptjs";
import { UserRepository } from "../database/repositories/UserRepository";
import { UserDTO } from "../core/dtos/User/UserDTO";
import { CreateUserDTO } from "../core/dtos/User/CreateUserDTO";
import { UpdateUserDTO } from "../core/dtos/User/UpdateUserDTO";
import { IUserService } from "./interfaces/IUserService";

export class UserService implements IUserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async getAllAsync(): Promise<UserDTO[]> {
    const users = await this.repository.getAll();
    return users.map(this.toDTO);
  }

  async getByIdAsync(email: string): Promise<UserDTO | null> {
    const user = await this.repository.getByEmailAsync(email);
    return user ? this.toDTO(user) : null;
  }

  async createAsync(dto: CreateUserDTO): Promise<UserDTO> {
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
    return this.toDTO(user);
  }

  async updateAsync(email: string, dto: UpdateUserDTO): Promise<UserDTO> {
    const updateData: any = {};
    if (dto.name !== undefined) updateData.Name = dto.name;
    if (dto.role !== undefined) updateData.Role = dto.role;
    if (dto.address !== undefined) updateData.Address = dto.address;
    if (dto.phoneNumber !== undefined) updateData.PhoneNumber = dto.phoneNumber;
    if (dto.cartId !== undefined) updateData.CartId = dto.cartId;
    const user = await this.repository.update(email, updateData);
    return this.toDTO(user);
  }

  async deleteAsync(email: string): Promise<boolean> {
    return await this.repository.delete(email);
  }

  private toDTO(user: any): UserDTO {
    return {
      email: user.Email,
      name: user.Name,
      role: user.Role,
      address: user.Address,
      phoneNumber: user.PhoneNumber,
      cartId: user.CartId,
    };
  }
}
