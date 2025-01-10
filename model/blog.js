const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust based on your setup

const Blog = sequelize.define('Blog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,  // Auto-increment the ID
    primaryKey: true,     // Set as primary key
  },
  blog_id: {
    type: DataTypes.STRING,   // Unique blog identifier
    allowNull: false,
    unique: true,             // Ensure this column is unique
  },
  photo: {
    type: DataTypes.STRING,   // Path to the photo
    allowNull: true,
  },
  news: {
    type: DataTypes.TEXT,     // Content of the blog post
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,     // Date of the blog post
    allowNull: false,
  },
  author_name: {
    type: DataTypes.STRING,   // Author name
    allowNull: false,
  },
  delete_at: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // Default to not deleted
  },
  created_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Blog;
