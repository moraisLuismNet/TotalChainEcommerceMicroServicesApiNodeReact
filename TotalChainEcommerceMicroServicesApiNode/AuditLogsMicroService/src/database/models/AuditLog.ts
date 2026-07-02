import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../core/config/database";

interface AuditLogAttributes {
  id: number;
  entityName: string;
  entityId: string;
  action: string;
  oldValues: string | null;
  newValues: string | null;
  changedBy: string;
  changedAt: Date;
}

interface AuditLogCreationAttributes extends Optional<AuditLogAttributes, "id" | "changedAt"> {}

export class AuditLog extends Model<AuditLogAttributes, AuditLogCreationAttributes> implements AuditLogAttributes {
  public id!: number;
  public entityName!: string;
  public entityId!: string;
  public action!: string;
  public oldValues!: string | null;
  public newValues!: string | null;
  public changedBy!: string;
  public changedAt!: Date;
}

AuditLog.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    entityName: { type: DataTypes.STRING, allowNull: false },
    entityId: { type: DataTypes.STRING, allowNull: false },
    action: { type: DataTypes.STRING, allowNull: false },
    oldValues: { type: DataTypes.TEXT, allowNull: true },
    newValues: { type: DataTypes.TEXT, allowNull: true },
    changedBy: { type: DataTypes.STRING, allowNull: false },
    changedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { sequelize, tableName: "AuditLogs", timestamps: false }
);
