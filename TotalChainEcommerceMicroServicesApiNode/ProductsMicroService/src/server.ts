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
import "./database/models/index";

import categoriesRoutes from "./api/routes/categoriesRoutes";
import subCategoriesRoutes from "./api/routes/subCategoriesRoutes";
import referencesRoutes from "./api/routes/referencesRoutes";
import productsRoutes from "./api/routes/productsRoutes";
import stocksRoutes from "./api/routes/stocksRoutes";

const app = express();
const PORT = process.env.PORT || 5002;

const corsOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",").map(o => o.trim()) : ["http://localhost:3000"];
app.use(cors({ origin: corsOrigins, methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"], credentials: true }));
app.options("*", cors());
app.use(express.json());
app.use(requestLogger);
app.use(rateLimiter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true, customSiteTitle: "ProductsMicroService", swaggerOptions: { persistAuthorization: true, filter: true, deepLinking: true } }));

app.use("/api/categories", categoriesRoutes);
app.use("/api/subcategories", subCategoriesRoutes);
app.use("/api/references", referencesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/stocks", stocksRoutes);

app.use(errorHandler);

app.get("/", (req, res) => { res.send("ProductsMicroService API. Visit /api-docs"); });

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => { console.log(`ProductsMicroService running on port ${PORT}`); console.log(`Swagger docs: http://localhost:${PORT}/api-docs`); });
  } catch (error) { console.error("Unable to start server:", error); }
}
start();
export default app;
