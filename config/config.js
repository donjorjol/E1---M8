require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: String(process.env.DB_PASSWORD), 
    database: process.env.DB_NAME || "gestion_tareas",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres"
  }
};