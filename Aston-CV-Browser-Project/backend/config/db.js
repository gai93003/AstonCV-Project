const mysql = require("mysql2");

const shouldUseSSL = ["1", "true", "yes"].includes((process.env.DB_SSL || "").toLowerCase());
const connectionUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;

let parsedConfig = {};

if (connectionUrl) {
  try {
    const url = new URL(connectionUrl);
    parsedConfig = {
      host: url.hostname,
      port: Number(url.port || 3306),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: decodeURIComponent(url.pathname.replace(/^\//, "")),
    };
  } catch (err) {
    console.error("Invalid DATABASE_URL/MYSQL_URL:", err.message);
  }
}

const db = mysql.createPool({
  host: parsedConfig.host || process.env.DB_HOST || "localhost",
  port: parsedConfig.port || Number(process.env.DB_PORT || 3306),
  user: parsedConfig.user || process.env.DB_USER || "root",
  password: parsedConfig.password || process.env.DB_PASSWORD || "",
  database: parsedConfig.database || process.env.DB_NAME || "railway",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT || 15000),
  ssl: shouldUseSSL ? { rejectUnauthorized: false } : undefined,
});

db.query("SELECT 1", (err) => {
  if (err) {
    const dbHost = parsedConfig.host || process.env.DB_HOST || "localhost";
    const dbPort = parsedConfig.port || Number(process.env.DB_PORT || 3306);
    console.error(`MySQL initial ping failed (${dbHost}:${dbPort}):`, err.message);
    return;
  }
  console.log("MySQL Connected");
});

module.exports = db;