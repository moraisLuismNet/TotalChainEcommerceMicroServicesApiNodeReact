import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../core/config/database";
import { Category } from "./Category";

class SubCategory extends Model {
  public Id!: string;
  public Name!: string;
  public Description?: string;
  public CategoryId!: string;
  public IsActive!: boolean;
  public readonly CreatedAt!: Date;
  public readonly UpdatedAt!: Date;
}

SubCategory.init({
  Id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
  Name: { type: DataTypes.STRING, allowNull: false },
  Description: { type: DataTypes.TEXT, allowNull: true },
  CategoryId: { type: DataTypes.STRING, allowNull: false },
  IsActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  sequelize,
  tableName: "SubCategories",
  timestamps: true,
  createdAt: 'CreatedAt',
  updatedAt: 'UpdatedAt'
});

export default SubCategory;
export { SubCategory };

export function setupSubCategoryAssociations() {
  SubCategory.belongsTo(Category, { foreignKey: 'CategoryId', as: 'Category' });
}
