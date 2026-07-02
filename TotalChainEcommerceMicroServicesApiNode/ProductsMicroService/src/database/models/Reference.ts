import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../core/config/database";
import { SubCategory } from "./SubCategory";

class Reference extends Model {
  public Id!: string;
  public Name!: string;
  public Description?: string;
  public SubCategoryId!: string;
  public IsActive!: boolean;
  public readonly CreatedAt!: Date;
  public readonly UpdatedAt!: Date;
}

Reference.init({
  Id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
  Name: { type: DataTypes.STRING, allowNull: false },
  Description: { type: DataTypes.TEXT, allowNull: true },
  SubCategoryId: { type: DataTypes.STRING, allowNull: false },
  IsActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  sequelize,
  tableName: "References",
  timestamps: true,
  createdAt: 'CreatedAt',
  updatedAt: 'UpdatedAt'
});

export default Reference;
export { Reference };

export function setupReferenceAssociations() {
  Reference.belongsTo(SubCategory, { foreignKey: 'SubCategoryId', as: 'SubCategory' });
}
