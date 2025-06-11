const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const boardMember = sequelize.define(
  "boardMember",
  {
    board_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "boards", // Referensi ke tabel 'boards' di service ini
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "member"),
      allowNull: false,
      defaultValue: "member",
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["board_id", "user_id"],
      },
    ],
  }
);

module.exports = boardMember;
