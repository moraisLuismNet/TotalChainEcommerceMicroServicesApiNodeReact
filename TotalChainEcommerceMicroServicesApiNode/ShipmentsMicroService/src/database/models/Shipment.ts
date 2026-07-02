import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../core/config/database";

export interface IShipmentAttributes {
  Id: number;
  OrderId: number;
  TrackingNumber: string;
  Status: string;
  CreatedAt: Date;
  OutForDeliveryAt: Date | null;
  InTransitAt: Date | null;
  DeliveredAt: Date | null;
  OriginAddress: string;
  DestinationAddress: string;
  OriginLatitude: number;
  OriginLongitude: number;
  DestinationLatitude: number;
  DestinationLongitude: number;
  UserEmail: string;
}

export class Shipment extends Model implements IShipmentAttributes {
  public Id!: number;
  public OrderId!: number;
  public TrackingNumber!: string;
  public Status!: string;
  public CreatedAt!: Date;
  public OutForDeliveryAt!: Date | null;
  public InTransitAt!: Date | null;
  public DeliveredAt!: Date | null;
  public OriginAddress!: string;
  public DestinationAddress!: string;
  public OriginLatitude!: number;
  public OriginLongitude!: number;
  public DestinationLatitude!: number;
  public DestinationLongitude!: number;
  public UserEmail!: string;
}

Shipment.init(
  {
    Id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    OrderId: { type: DataTypes.INTEGER, allowNull: false },
    TrackingNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
    Status: { type: DataTypes.STRING, allowNull: false },
    CreatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    OutForDeliveryAt: { type: DataTypes.DATE, allowNull: true },
    InTransitAt: { type: DataTypes.DATE, allowNull: true },
    DeliveredAt: { type: DataTypes.DATE, allowNull: true },
    OriginAddress: { type: DataTypes.STRING, allowNull: false },
    DestinationAddress: { type: DataTypes.STRING, allowNull: false },
    OriginLatitude: { type: DataTypes.DOUBLE, allowNull: false },
    OriginLongitude: { type: DataTypes.DOUBLE, allowNull: false },
    DestinationLatitude: { type: DataTypes.DOUBLE, allowNull: false },
    DestinationLongitude: { type: DataTypes.DOUBLE, allowNull: false },
    UserEmail: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, tableName: "Shipments", timestamps: false }
);

export default Shipment;
