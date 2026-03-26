const config = {
  db: {
    /* Don't expose password or any sensitive info */

    host: "localhost",
    user: "root",
    password: "",
    database: "course",
    connectTimeout: 60000
  },
};

module.exports = config;