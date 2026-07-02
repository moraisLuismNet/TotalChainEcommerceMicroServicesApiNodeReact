import { sequelize } from "../../core/config/database";
import { EmailQueue } from "./EmailQueue";

const models = { EmailQueue };

export { sequelize, models, EmailQueue };
