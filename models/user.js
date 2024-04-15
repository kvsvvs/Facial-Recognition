const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db");

class User extends Model {}

User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Storing face encoding as an array of floats. Adjust the length if necessary.
    faceEncoding: {
      type: DataTypes.ARRAY(DataTypes.FLOAT),
      allowNull: false,
    },
  },
  {
    sequelize, // Pass the sequelize instance
    modelName: "User", // Name of the model
    tableName: "users", // Explicitly specify the table name
    freezeTableName: true, // Prevent Sequelize from pluralizing the table name
  }
);

module.exports = User;
