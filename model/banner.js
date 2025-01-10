const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Banner = sequelize.define(
  "Banner",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Auto incrementing ID for the banner
    },
    banner_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure banner_id is unique when creating new banners
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    delete_at: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Default value for soft deletion (0 = not deleted, 1 = deleted)
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Automatically set the current timestamp when the banner is created
    },
  },
  {
    tableName: "banners", // Name of the table
  }
);

module.exports = Banner;
