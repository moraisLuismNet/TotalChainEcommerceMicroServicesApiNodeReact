import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../core/config/database";
export interface IPaymentAttributes {
  Id: number;
  OrderId: number | null;
  CheckoutData: string | null;
  StripeSessionId: string;
  StripePaymentIntentId: string | null;
  Status: string;
  Amount: number;
  Currency: string;
  PaidAt: Date | null;
  CreatedAt: Date;
}
export class Payment extends Model implements IPaymentAttributes {
  public Id!: number;
  public OrderId!: number | null;
  public CheckoutData!: string | null;
  public StripeSessionId!: string;
  public StripePaymentIntentId!: string | null;
  public Status!: string;
  public Amount!: number;
  public Currency!: string;
  public PaidAt!: Date | null;
  public CreatedAt!: Date;
}
Payment.init(
  {
    Id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    OrderId: { type: DataTypes.INTEGER, allowNull: true },
    CheckoutData: { type: DataTypes.TEXT, allowNull: true },
    StripeSessionId: { type: DataTypes.STRING, allowNull: false },
    StripePaymentIntentId: { type: DataTypes.STRING, allowNull: true },
    Status: { type: DataTypes.STRING, defaultValue: "pending" },
    Amount: { type: DataTypes.DECIMAL, allowNull: false },
    Currency: { type: DataTypes.STRING, defaultValue: "eur" },
    PaidAt: { type: DataTypes.DATE, allowNull: true },
    CreatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { sequelize, tableName: "Payments", timestamps: false }
);
export default Payment;
