const mysql = require('mysql2/promise');
const config = require('../config');

async function query(sql, params) {
  const connnection = await mysql.createConnection(config.db);
  const [results, ] = await connnection.execute(sql, params);

  return results;
}

module.exports = {
  query
}