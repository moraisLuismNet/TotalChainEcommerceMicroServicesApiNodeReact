require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
module.exports = {
  development: {
    dialect: process.env.DB_PROVIDER?.toLowerCase() === 'mysql' ? 'mysql'
      : process.env.DB_PROVIDER?.toLowerCase() === 'sqlserver' ? 'mssql'
      : process.env.DB_PROVIDER?.toLowerCase() === 'sqlite' ? 'sqlite' : 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_DATABASE || 'UsersManagerMS',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    storage: process.env.DB_SQLITE_CONNECTION?.replace('Data Source=', '') || undefined,
    define: { timestamps: false, freezeTableName: true },
  },
};
