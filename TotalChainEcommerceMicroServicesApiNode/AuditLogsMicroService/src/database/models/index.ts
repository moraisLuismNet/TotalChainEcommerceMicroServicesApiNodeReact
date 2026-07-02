import { sequelize } from "../../core/config/database";
import { AuditLog } from "./AuditLog";

const models = { AuditLog };

export { sequelize, models, AuditLog };
