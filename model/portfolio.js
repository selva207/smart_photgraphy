const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path to your database configuration

const Portfolio = sequelize.define('Portfolio', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,  // Auto-increment the ID
    primaryKey: true,     // Set as the primary key
  },
  portfolio_id: {
    type: DataTypes.STRING,  // Unique portfolio identifier
    allowNull: false,
    unique: true,  // Ensure this column is unique
  },
  images: {
    type: DataTypes.TEXT,  // Store images as text (Base64 encoded or file paths)
    allowNull: false,
  },
  delete_at: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // Default to not deleted (soft delete flag)
  },
  created_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Automatically sets the creation date
  },
});

module.exports = Portfolio;
