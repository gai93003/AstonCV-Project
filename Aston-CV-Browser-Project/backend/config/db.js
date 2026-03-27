const mysql = require("mysql2");

const shouldUseSSL = ["1", "true", "yes"].includes((process.env.DB_SSL || "").toLowerCase());

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "railway",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: shouldUseSSL ? { rejectUnauthorized: false } : undefined,
});

db.query("SELECT 1", (err) => {
  if (err) {
    console.error("MySQL initial ping failed:", err.message);
    return;
  }
  console.log("MySQL Connected");
});

module.exports = db;