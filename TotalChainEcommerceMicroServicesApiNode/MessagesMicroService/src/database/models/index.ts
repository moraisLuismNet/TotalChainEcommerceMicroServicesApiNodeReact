import { sequelize } from "../../core/config/database";
import { NotificationQueue } from "./NotificationQueue";

const models = { NotificationQueue };

export { sequelize, models, NotificationQueue };
