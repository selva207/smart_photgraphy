const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust based on your setup

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  category_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // Automatically generate unique ID
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  delete_at: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // Soft delete indicator
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Automatically sets the current date
  },
}, {
  timestamps: false, // Disable the default timestamps (createdAt, updatedAt)
  tableName: 'gallery', // Custom table name if required
});

module.exports = Category;
