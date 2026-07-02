import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../core/config/database";

class Cart extends Model {
  public IdCart!: number;
  public UserEmail!: string;
  public TotalPrice!: number;
  public Enabled!: boolean;
  public CreatedAt!: Date;
  public UpdatedAt!: Date;
}

Cart.init({
  IdCart: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  UserEmail: { type: DataTypes.STRING, allowNull: false, unique: true },
  TotalPrice: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  Enabled: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  sequelize,
  tableName: "Carts",
  timestamps: true,
  createdAt: 'CreatedAt',
  updatedAt: 'UpdatedAt'
});

export default Cart;
export { Cart };
