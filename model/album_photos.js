const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust based on your setup
const Album = require('./Album'); // Adjust path to the Album model

const AlbumImages = sequelize.define('AlbumImages', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,  // Auto-increment the ID
    primaryKey: true,     // Set as primary key
  },
  album_image_id: {
    type: DataTypes.STRING,   // Unique album image identifier
    allowNull: false,
    unique: true,             // Ensure this column is unique
  },
  album_id: {
    type: DataTypes.INTEGER, // Foreign key to the Album model
    allowNull: false,
    references: {
      model: Album,
      key: 'id',
    },
  },
  img: {
    type: DataTypes.TEXT, // Can be a URL or base64-encoded image string
    allowNull: false,
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

Album.hasMany(AlbumImages, { foreignKey: 'album_id' });
AlbumImages.belongsTo(Album, { foreignKey: 'album_id' });

module.exports = AlbumImages;
