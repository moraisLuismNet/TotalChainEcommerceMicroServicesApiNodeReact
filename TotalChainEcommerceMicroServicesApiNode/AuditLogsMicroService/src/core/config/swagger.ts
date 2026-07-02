import swaggerJsdoc from "swagger-jsdoc";
import { version } from "../../../package.json";
import dotenv from "dotenv";
dotenv.config();
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "AuditLogsMicroService", version, description: process.env.SWAGGER_DESCRIPTION || "Audit logging microservice", contact: { name: process.env.SWAGGER_CONTACT_NAME || "API Support", email: process.env.SWAGGER_CONTACT_EMAIL || "" } },
    servers: [{ url: "http://localhost:5007", description: process.env.SWAGGER_SERVER_DESCRIPTION || "Development server" }],
    components: { securitySchemes: { BearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } } },
    security: [],
  },
  apis: ["./src/api/routes/*.ts", "./build/api/routes/*.js"],
};
const specs = swaggerJsdoc(options);
export default specs;
