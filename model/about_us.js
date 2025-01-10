const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Adjust the path based on your setup

const AboutUs = sequelize.define('AboutUs', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,  // Auto-increment the ID
    primaryKey: true,     // Set as primary key
  },
  about_id: {
    type: DataTypes.STRING,   // Unique about_us identifier
    allowNull: false,
    unique: true,             // Ensure this column is unique
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,        // Make title mandatory
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,         // Allow content to be nullable
  },
  content_1: {
    type: DataTypes.TEXT,
    allowNull: true,         // Allow content_1 to be nullable
  },
  point_1: {
    type: DataTypes.STRING,
    allowNull: true,         // Allow point_1 to be nullable
  },
  point_2: {
    type: DataTypes.STRING,
    allowNull: true,         // Allow point_2 to be nullable
  },
  point_3: {
    type: DataTypes.STRING,
    allowNull: true,         // Allow point_3 to be nullable
  },
  title_1: {
    type: DataTypes.STRING,
    allowNull: true,         // Allow title_1 to be nullable
  },
  content_2: {
    type: DataTypes.TEXT,
    allowNull: true,         // Allow content_2 to be nullable
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,         // Allow image URL to be nullable
  },
  delete_at: {
    type: DataTypes.INTEGER,
    defaultValue: 0,         // Default value is 0, meaning not deleted
  },
  created_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Automatically sets the creation date
  },
}, {
  tableName: 'about_us',  // Optional: specify the table name (if different)
});

module.exports = AboutUs;
