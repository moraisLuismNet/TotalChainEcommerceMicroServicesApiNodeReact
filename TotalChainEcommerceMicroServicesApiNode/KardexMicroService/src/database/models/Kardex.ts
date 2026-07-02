import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../core/config/database";
export interface IKardexAttributes {
  Id: number;
  ProductId: string;
  Date: Date;
  MovementType: string;
  Quantity: number;
  StockBefore: number;
  StockAfter: number;
}
export class Kardex extends Model implements IKardexAttributes {
  public Id!: number;
  public ProductId!: string;
  public Date!: Date;
  public MovementType!: string;
  public Quantity!: number;
  public StockBefore!: number;
  public StockAfter!: number;
}
Kardex.init(
  {
    Id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ProductId: { type: DataTypes.STRING, allowNull: false },
    Date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    MovementType: { type: DataTypes.STRING, allowNull: false },
    Quantity: { type: DataTypes.INTEGER, allowNull: false },
    StockBefore: { type: DataTypes.INTEGER, allowNull: false },
    StockAfter: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: "Kardexes", timestamps: false }
);
export default Kardex;
