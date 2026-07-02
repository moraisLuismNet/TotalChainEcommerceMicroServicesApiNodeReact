import dotenv from "dotenv"; dotenv.config();
import express from "express"; import cors from "cors";
import swaggerUi from "swagger-ui-express"; import swaggerSpec from "./core/config/swagger";
import { errorHandler } from "./api/middleware/errorHandler";
import { requestLogger } from "./api/middleware/requestLogger";
import { rateLimiter } from "./api/middleware/rateLimiter";
import { sequelize } from "./core/config/database";
import paymentRoutes from "./api/routes/paymentRoutes";
const app = express(); const PORT = process.env.PORT || 5004;
const corsOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim()) : ["http://localhost:3000"];
app.use(cors({ origin: corsOrigins, methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"], allowedHeaders: ["Content-Type","Authorization"], credentials: true }));
app.options("*", cors());
app.use(express.json({
  verify: (req: any, _res, buf) => { req.rawBody = buf.toString(); }
}));
app.use(requestLogger); app.use(rateLimiter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true, customSiteTitle: "PaymentsMicroService", swaggerOptions: { persistAuthorization: true } }));
app.use("/api/payments", paymentRoutes);
app.use(errorHandler);
async function start() { try { await sequelize.authenticate(); await sequelize.sync(); app.listen(PORT, () => { console.log(`PaymentsMicroService on port ${PORT}`); }); } catch (e) { console.error("Start error:", e); process.exit(1); } } start();
export default app;
