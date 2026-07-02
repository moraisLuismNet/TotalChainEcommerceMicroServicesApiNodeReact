import { Sequelize, Dialect } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
const getSequelizeInstance = () => {
  let dialect: Dialect;
  let connectionString: string;
  const provider = process.env.DB_PROVIDER || "PostgreSQL";
  switch (provider) {
    case "SqlServer": dialect = "mssql"; connectionString = process.env.DB_SQLSERVER_CONNECTION || ""; break;
    case "MySQL": dialect = "mysql"; connectionString = process.env.DB_MYSQL_CONNECTION || ""; break;
    case "PostgreSQL": dialect = "postgres"; connectionString = process.env.DB_POSTGRESQL_CONNECTION || `Host=${process.env.DB_HOST || "localhost"};Database=${process.env.DB_DATABASE};Username=${process.env.DB_USER};Password=${process.env.DB_PASSWORD};Port=${process.env.DB_PORT || "5432"}`; break;
    case "SQLite": dialect = "sqlite"; connectionString = process.env.DB_SQLITE_CONNECTION || ""; break;
    default: throw new Error(`Unsupported database provider: ${provider}`);
  }
  const parseConnectionString = (connString: string) => {
    const params: { [key: string]: string } = {};
    connString.split(";").forEach((pair) => { const [key, value] = pair.split("="); if (key && value) params[key.trim().toLowerCase()] = value.trim(); });
    return params;
  };
  if (dialect === "sqlite" && connectionString.startsWith("Data Source=")) {
    const storage = connectionString.replace("Data Source=", "").replace(";", "");
    return new Sequelize({ dialect, storage, logging: false, define: { timestamps: false, freezeTableName: true }, pool: { max: 5, min: 0, acquire: 30000, idle: 10000 } });
  }
  const params = parseConnectionString(connectionString);
  const defaultPorts: { [key: string]: string } = { postgres: "5432", mysql: "3306", mssql: "1433" };
  return new Sequelize({ dialect, host: params.host || params.server, port: parseInt(params.port || defaultPorts[dialect] || "5432"), username: params.username || params.user || params["user id"], password: params.password, database: params.database || params["initial catalog"], logging: false, define: { timestamps: false, freezeTableName: true }, pool: { max: 20, min: 2, acquire: 60000, idle: 30000 } });
};
const sequelize = getSequelizeInstance();
export { sequelize };
