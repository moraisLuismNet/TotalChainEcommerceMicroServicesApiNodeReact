import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../core/config/database";

interface NotificationQueueAttributes {
  notificationQueueId: number;
  phoneNumber: string;
  message: string;
  orderId: number | null;
  status: string;
  retryCount: number;
  errorMessage: string | null;
  createdAt: Date;
  sentAt: Date | null;
  scheduledAt: Date;
}

interface NotificationQueueCreationAttributes extends Optional<NotificationQueueAttributes, "notificationQueueId" | "status" | "retryCount" | "errorMessage" | "createdAt" | "sentAt"> {}

export class NotificationQueue extends Model<NotificationQueueAttributes, NotificationQueueCreationAttributes> implements NotificationQueueAttributes {
  public notificationQueueId!: number;
  public phoneNumber!: string;
  public message!: string;
  public orderId!: number | null;
  public status!: string;
  public retryCount!: number;
  public errorMessage!: string | null;
  public createdAt!: Date;
  public sentAt!: Date | null;
  public scheduledAt!: Date;
}

NotificationQueue.init(
  {
    notificationQueueId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    phoneNumber: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.STRING, allowNull: false },
    orderId: { type: DataTypes.INTEGER, allowNull: true },
    status: { type: DataTypes.STRING, defaultValue: "Pending" },
    retryCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    errorMessage: { type: DataTypes.STRING, allowNull: true },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    sentAt: { type: DataTypes.DATE, allowNull: true },
    scheduledAt: { type: DataTypes.DATE, allowNull: false },
  },
  { sequelize, tableName: "NotificationQueues", timestamps: false }
);
