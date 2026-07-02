import swaggerJsdoc from "swagger-jsdoc";
import { version } from "../../../package.json";
import dotenv from "dotenv";
dotenv.config();
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: { title: process.env.SWAGGER_TITLE || "ProductsMicroService API", version, description: process.env.SWAGGER_DESCRIPTION || "Products catalog microservice", contact: { name: "API Support", email: "" } },
    servers: [{ url: process.env.SWAGGER_SERVER_URL || "http://localhost:5002", description: process.env.SWAGGER_SERVER_DESCRIPTION || "Development server" }],
    components: { securitySchemes: { BearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } } },
    security: [],
  },
  apis: ["./src/api/routes/*.ts", "./build/api/routes/*.js"],
};
const specs = swaggerJsdoc(options);
export default specs;
