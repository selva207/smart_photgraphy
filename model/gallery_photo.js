const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./gallery'); // Import Category model

const Subcategory = sequelize.define('Subcategory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  subcategory_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true,
  },
  category_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Category,
      key: 'category_id', // Foreign key pointing to the Category model
    },
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  delete_at: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  created_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
  tableName: 'gallery_sub',
});

// Corrected Association (Alias consistency)
Category.hasMany(Subcategory, {
  foreignKey: 'category_id',
  sourceKey: 'category_id',
  as: 'subcategories', // Alias for subcategories
});

Subcategory.belongsTo(Category, {
  foreignKey: 'category_id',
  targetKey: 'category_id',
  as: 'category', // Alias for category
});

module.exports = Subcategory;
