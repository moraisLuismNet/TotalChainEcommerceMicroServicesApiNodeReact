import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../core/config/database";
import { Order } from "./Order";

class OrderDetail extends Model {
  public IdOrderDetail!: number;
  public OrderId!: number;
  public ProductId!: string;
  public Amount!: number;
  public Price!: number;
}

OrderDetail.init({
  IdOrderDetail: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  OrderId: { type: DataTypes.INTEGER, allowNull: false },
  ProductId: { type: DataTypes.STRING, allowNull: false },
  Amount: { type: DataTypes.INTEGER, allowNull: false },
  Price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, {
  sequelize,
  tableName: "OrderDetails",
  timestamps: false
});

export default OrderDetail;
export { OrderDetail };

export function setupOrderDetailAssociations() {
  OrderDetail.belongsTo(Order, { foreignKey: 'OrderId', as: 'Order' });
  Order.hasMany(OrderDetail, { foreignKey: 'OrderId', as: 'OrderDetails' });
}
