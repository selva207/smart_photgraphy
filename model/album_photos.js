const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust based on your setup
const Album = require('../model/albums')
const SubCategory = sequelize.define('SubCategory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true, // Auto-increment primary key for subcategory
  },
  subcategory_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,  // Unique subcategory ID
  },
  album_id: {
    type: DataTypes.STRING,
    allowNull: false,  // Reference to the album (category)
    references: {
      model: 'albums',  // Ensure this matches the name of your Album model
      key: 'album_id',  // The album_id in the Album table
    },
  },
  img: {
    type: DataTypes.TEXT,  // Store image as a base64 string
    allowNull: false,
  },
  delete_at: {
    type: DataTypes.INTEGER,
    defaultValue: 0,  // Default to not deleted
  },
  created_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = SubCategory;
