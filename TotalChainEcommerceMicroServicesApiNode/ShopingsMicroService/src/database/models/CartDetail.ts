import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../core/config/database";
import { Cart } from "./Cart";

class CartDetail extends Model {
  public IdCartDetail!: number;
  public CartId!: number;
  public ProductId!: string;
  public Amount!: number;
  public Price!: number;
}

CartDetail.init({
  IdCartDetail: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  CartId: { type: DataTypes.INTEGER, allowNull: false },
  ProductId: { type: DataTypes.STRING, allowNull: false },
  Amount: { type: DataTypes.INTEGER, allowNull: false },
  Price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, {
  sequelize,
  tableName: "CartDetails",
  timestamps: false
});

export default CartDetail;
export { CartDetail };

export function setupCartDetailAssociations() {
  CartDetail.belongsTo(Cart, { foreignKey: 'CartId', as: 'Cart' });
  Cart.hasMany(CartDetail, { foreignKey: 'CartId', as: 'CartDetails' });
}
