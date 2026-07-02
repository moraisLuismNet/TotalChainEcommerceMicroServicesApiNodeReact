import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../core/config/database";

class User extends Model {
  public Email!: string;
  public Name!: string;
  public Password!: string;
  public Salt!: string;
  public Role!: string;
  public Address?: string;
  public PhoneNumber?: string;
  public CartId?: number;
}

User.init(
  {
    Email: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    Name: { type: DataTypes.STRING, allowNull: false },
    Password: { type: DataTypes.STRING, allowNull: false },
    Salt: { type: DataTypes.STRING, allowNull: false },
    Role: { type: DataTypes.STRING, defaultValue: "User", allowNull: false },
    Address: { type: DataTypes.STRING, allowNull: true },
    PhoneNumber: { type: DataTypes.STRING, allowNull: true },
    CartId: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    tableName: "Users",
    timestamps: false,
  }
);

export default User;
export { User };
