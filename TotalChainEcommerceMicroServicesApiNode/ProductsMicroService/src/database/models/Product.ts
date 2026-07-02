import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../core/config/database";
import { Reference } from "./Reference";

class Product extends Model {
  public Id!: string;
  public Code!: string;
  public Name!: string;
  public Description?: string;
  public ImageProduct?: string;
  public ReferenceId!: string;
  public UnitPrice!: number;
  public CostPrice!: number;
  public MinStock!: number;
  public IsActive!: boolean;
  public readonly CreatedAt!: Date;
  public readonly UpdatedAt!: Date;
}

Product.init({
  Id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
  Code: { type: DataTypes.STRING, allowNull: false },
  Name: { type: DataTypes.STRING, allowNull: false },
  Description: { type: DataTypes.TEXT, allowNull: true },
  ImageProduct: { type: DataTypes.STRING, allowNull: true },
  ReferenceId: { type: DataTypes.STRING, allowNull: false },
  UnitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  CostPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  MinStock: { type: DataTypes.INTEGER, defaultValue: 5 },
  IsActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  sequelize,
  tableName: "Products",
  timestamps: true,
  createdAt: 'CreatedAt',
  updatedAt: 'UpdatedAt'
});

export default Product;
export { Product };

export function setupProductAssociations() {
  Product.belongsTo(Reference, { foreignKey: 'ReferenceId', as: 'Reference' });
}
