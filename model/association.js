const Category = require('./gallery'); // Import the Category model
const Subcategory = require('./gallery_photo');

// Defining the relationship between Category and Subcategory
Category.hasMany(Subcategory, {
  foreignKey: 'category_id',
  sourceKey: 'category_id',
  as: 'subcategories', // Alias for subcategories
  onDelete: 'CASCADE', // Optional: Cascade delete
  onUpdate: 'CASCADE', // Optional: Cascade update
});

Subcategory.belongsTo(Category, {
  foreignKey: 'category_id',
  targetKey: 'category_id',
  as: 'category', // Alias for category
  onDelete: 'CASCADE', // Optional: Cascade delete
  onUpdate: 'CASCADE', // Optional: Cascade update
});
