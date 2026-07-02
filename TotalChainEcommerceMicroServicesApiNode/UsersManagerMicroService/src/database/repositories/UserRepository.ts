import { User } from "../models/User";
import { BaseRepository } from "./BaseRepository";
import { IUserRepository } from "./interfaces/IUserRepository";

export class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor() {
    super(User);
  }

  async getByEmailAsync(email: string): Promise<User | null> {
    return await this.findOne({ where: { Email: email } });
  }
}
