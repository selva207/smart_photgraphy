const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust based on your setup

const Album = sequelize.define('Album', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,  // Auto-increment the ID
    primaryKey: true,     // Set as primary key
  },
  album_id: {
    type: DataTypes.STRING,   // Unique album identifier
    allowNull: false,
    unique: true,             // Ensure this column is unique
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  thumbnail: {
    type: DataTypes.STRING,   // To store the path or URL of the thumbnail image
    allowNull: true,
  },
  delete_at: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // Default not deleted
  },
  created_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Album;
