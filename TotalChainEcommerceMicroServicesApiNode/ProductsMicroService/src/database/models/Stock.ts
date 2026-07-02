import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../core/config/database";
import { Product } from "./Product";

class Stock extends Model {
  public Id!: string;
  public ProductId!: string;
  public Quantity!: number;
  public Warehouse!: string;
  public CreatedBy!: string;
  public UpdatedBy!: string;
}

Stock.init({
  Id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
  ProductId: { type: DataTypes.STRING, allowNull: false },
  Quantity: { type: DataTypes.INTEGER, allowNull: false },
  Warehouse: { type: DataTypes.STRING, allowNull: false },
  CreatedBy: { type: DataTypes.STRING, allowNull: true },
  UpdatedBy: { type: DataTypes.STRING, allowNull: true }
}, {
  sequelize,
  tableName: "Stocks",
  timestamps: false
});

export default Stock;
export { Stock };

export function setupStockAssociations() {
  Stock.belongsTo(Product, { foreignKey: 'ProductId', as: 'Product' });
}
