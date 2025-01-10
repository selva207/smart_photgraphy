const { v4: uuidv4 } = require('uuid');
const Album = require('../model/albums'); // Adjust path based on your setup
const AlbumImages = require('../model/album_photos');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure 'uploads' folder exists or create it
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // Create folder if it doesn't exist
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir); // Store uploaded files in 'uploads' folder
    },
    filename: (req, file, cb) => {
      // Generate a unique filename with UUID and timestamp
      const uniqueName = uuidv4() + '-' + Date.now() + path.extname(file.originalname);
      cb(null, uniqueName); // Use the unique filename
    },
  });
  
  const upload = multer({ storage }).single('thumbnail');

// Listing API to get all albums
exports.getAllAlbums = async (req, res) => {
    try {
      // Fetch all albums from the database (excluding deleted ones, where delete_at is 1)
      const albums = await Album.findAll({
        where: {
          delete_at: 0,  // Only fetch albums that are not marked as deleted
        },
      });
  
      // If no albums found, return an empty array
      if (!albums || albums.length === 0) {
        return res.status(404).json({
          status: 404,
          msg: 'No albums found',
          data: [],
        });
      }
  
      return res.status(200).json({
        status: 200,
        msg: 'Albums retrieved successfully',
        data: albums,
      });
    } catch (error) {
      console.error('Error fetching albums:', error);
      return res.status(500).json({
        status: 500,
        msg: 'Internal server error',
        error: error.message,
      });
    }
  };
  

// Create Album (Category) with thumbnail upload
exports.createAlbum = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          msg: 'Error uploading thumbnail',
          error: err.message,
        });
      }
  
      try {
        const { name, description } = req.body;
        let thumbnail = null;
  
        // Check if thumbnail was uploaded
        if (req.file) {
          // If a file is uploaded, get the unique filename
          thumbnail = req.file.filename; // Store the unique filename of the uploaded file
        }
  
        // Validate input
        if (!name) {
          return res.status(400).json({
            status: 400,
            msg: 'Album name is required',
          });
        }
  
        // Generate a unique album_id
        const album_id = uuidv4(); // You can use any other logic to generate a unique ID
  
        // Create a new album
        const newAlbum = await Album.create({
          album_id,        // Unique album identifier
          name,
          description,
          thumbnail,       // Store the thumbnail path (the unique filename)
          delete_at: 0,    // Default to not deleted
          created_date: new Date(),
        });
  
        return res.status(201).json({
          status: 201,
          msg: 'Album created successfully',
          data: newAlbum,
        });
      } catch (error) {
        console.error('Error creating album:', error);
        return res.status(500).json({
          status: 500,
          msg: 'Internal server error',
          error: error.message,
        });
      }
    });
  };


// Update Album (Category) with optional thumbnail upload
exports.updateAlbum = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          msg: 'Error uploading thumbnail',
          error: err.message,
        });
      }
  
      try {
        const { album_id, name, description } = req.body;
        const albumToUpdate = await Album.findOne({ where: { album_id } });
  
        if (!albumToUpdate) {
          return res.status(404).json({
            status: 404,
            msg: 'Album not found',
          });
        }
  
        // Check if thumbnail was uploaded, if yes, update the thumbnail field
        let thumbnail = albumToUpdate.thumbnail;  // Keep the existing thumbnail by default
        if (req.file) {
          // If a new thumbnail was uploaded, update the thumbnail field
          thumbnail = req.file.filename;  // Store the new unique filename
        }
  
        // Update album with new details (name, description, and optional thumbnail)
        const updatedAlbum = await albumToUpdate.update({
          name: name || albumToUpdate.name,         // Update name if provided, otherwise keep the existing one
          description: description || albumToUpdate.description,  // Update description if provided
          thumbnail,  // Update thumbnail if a new one is uploaded
          updated_date: new Date(),  // Optionally store the date when the album was last updated
        });
  
        return res.status(200).json({
          status: 200,
          msg: 'Album updated successfully',
          data: updatedAlbum,
        });
      } catch (error) {
        console.error('Error updating album:', error);
        return res.status(500).json({
          status: 500,
          msg: 'Internal server error',
          error: error.message,
        });
      }
    });
  };
  

// Soft Delete Album (Mark delete_at = 1)
exports.softDeleteAlbum = async (req, res) => {
    try {
      const { album_id } = req.body; // Get the album_id to mark as deleted
  
      // Find the album by album_id
      const album = await Album.findOne({ where: { album_id } });
  
      if (!album) {
        return res.status(404).json({
          status: 404,
          msg: 'Album not found',
        });
      }
  
      // Mark album as deleted (set delete_at = 1)
      album.delete_at = 1;
      await album.save();
  
      return res.status(200).json({
        status: 200,
        msg: 'Album soft deleted successfully',
      });
    } catch (error) {
      console.error('Error soft deleting album:', error);
      return res.status(500).json({
        status: 500,
        msg: 'Internal server error',
        error: error.message,
      });
    }
  };
  