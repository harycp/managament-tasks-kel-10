const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const list = sequelize.define(
  "list",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    board_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "boards",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = list;
