import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../core/config/database";

interface EmailQueueAttributes {
  idEmailQueue: number;
  toEmail: string;
  subject: string;
  body: string;
  emailType: string;
  scheduledSendTime: Date;
  sentAt: Date | null;
  errorMessage: string | null;
  createdAt: Date;
  orderId: number | null;
}

interface EmailQueueCreationAttributes extends Optional<EmailQueueAttributes, "idEmailQueue" | "sentAt" | "errorMessage" | "createdAt" | "orderId"> {}

export class EmailQueue extends Model<EmailQueueAttributes, EmailQueueCreationAttributes> implements EmailQueueAttributes {
  public idEmailQueue!: number;
  public toEmail!: string;
  public subject!: string;
  public body!: string;
  public emailType!: string;
  public scheduledSendTime!: Date;
  public sentAt!: Date | null;
  public errorMessage!: string | null;
  public createdAt!: Date;
  public orderId!: number | null;
}

EmailQueue.init(
  {
    idEmailQueue: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    toEmail: { type: DataTypes.STRING, allowNull: false },
    subject: { type: DataTypes.STRING, allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false },
    emailType: { type: DataTypes.STRING, allowNull: false },
    scheduledSendTime: { type: DataTypes.DATE, allowNull: false },
    sentAt: { type: DataTypes.DATE, allowNull: true },
    errorMessage: { type: DataTypes.STRING, allowNull: true },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    orderId: { type: DataTypes.INTEGER, allowNull: true },
  },
  { sequelize, tableName: "EmailQueues", timestamps: false }
);
