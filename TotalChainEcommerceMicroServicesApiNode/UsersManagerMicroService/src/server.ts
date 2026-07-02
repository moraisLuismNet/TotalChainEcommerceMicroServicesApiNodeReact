import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./core/config/swagger";
import { errorHandler } from "./api/middleware/errorHandler";
import { requestLogger } from "./api/middleware/requestLogger";
import { rateLimiter } from "./api/middleware/rateLimiter";
import { sequelize } from "./core/config/database";

import authRoutes from "./api/routes/authRoutes";
import usersRoutes from "./api/routes/usersRoutes";

const app = express();
const PORT = process.env.PORT || 5001;

const corsOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim()) : ["http://localhost:3000"];
app.use(cors({ origin: corsOrigins, methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"], allowedHeaders: ["Content-Type","Authorization"], credentials: true }));
app.options("*", cors());
app.use(express.json());
app.use(requestLogger);
app.use(rateLimiter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true, customSiteTitle: "UsersManagerMicroService", swaggerOptions: { persistAuthorization: true, filter: true, deepLinking: true } }));

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

app.use(errorHandler);

app.get("/", (req, res) => { res.send("UsersManagerMicroService API. Visit /api-docs"); });

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => { console.log(`UsersManagerMicroService running on port ${PORT}`); console.log(`Swagger docs: http://localhost:${PORT}/api-docs`); });
  } catch (error) { console.error("Unable to start server:", error); process.exit(1); }
}
start();
export default app;
