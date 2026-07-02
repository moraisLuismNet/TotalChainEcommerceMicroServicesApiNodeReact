import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../core/config/database";

class Order extends Model {
  public IdOrder!: number;
  public OrderDate!: Date;
  public Total!: number;
  public UserEmail!: string;
  public CartId!: number;
  public PaymentMethod!: string;
  public Status!: string;
}

Order.init({
  IdOrder: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  OrderDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  PaymentMethod: { type: DataTypes.STRING, defaultValue: "Credit Card" },
  Total: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  UserEmail: { type: DataTypes.STRING, allowNull: false },
  CartId: { type: DataTypes.INTEGER, allowNull: false },
  Status: { type: DataTypes.STRING, defaultValue: "pending" }
}, {
  sequelize,
  tableName: "Orders",
  timestamps: false
});

export default Order;
export { Order };
