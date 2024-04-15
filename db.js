const { Sequelize } = require("sequelize");

// Create a new Sequelize instance with your database connection information.
const sequelize = new Sequelize("facial_recog", "postgres", "9335121292asD@", {
  host: "localhost",
  dialect: "postgres",
});

module.exports = sequelize;
