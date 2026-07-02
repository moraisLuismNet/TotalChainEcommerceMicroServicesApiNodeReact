import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../core/config/database";

class Category extends Model {
  public Id!: string;
  public Name!: string;
  public Description?: string;
  public IsActive!: boolean;
  public readonly CreatedAt!: Date;
  public readonly UpdatedAt!: Date;
}

Category.init({
  Id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
  Name: { type: DataTypes.STRING, allowNull: false },
  Description: { type: DataTypes.TEXT, allowNull: true },
  IsActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  sequelize,
  tableName: "Categories",
  timestamps: true,
  createdAt: 'CreatedAt',
  updatedAt: 'UpdatedAt'
});

export default Category;
export { Category };
