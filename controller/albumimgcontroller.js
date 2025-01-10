const { v4: uuidv4 } = require('uuid');
const SubCategory = require('../model/album_photos'); // Adjust path
const Album = require('../model/albums'); // Adjust path

// Listing Subcategories for a Particular Album
exports.listSubcategoriesForAlbum = async (req, res) => {
    const { album_id } = req.params;  // Get album_id from the request parameters
  
    try {
      // Find subcategories for the specified album
      const subcategories = await SubCategory.findAll({
        where: { album_id, delete_at: 0 },  // Only non-deleted subcategories for the given album
      });
  
      if (subcategories.length === 0) {
        return res.status(404).json({
          status: 404,
          msg: 'No subcategories found for this album',
        });
      }
  
      return res.status(200).json({
        status: 200,
        msg: 'Subcategories retrieved successfully',
        data: subcategories,
      });
    } catch (error) {
      console.error('Error retrieving subcategories:', error);
      return res.status(500).json({
        status: 500,
        msg: 'Internal server error',
        error: error.message,
      });
    }
  };
  

// Create Subcategory with multiple images (base64 encoded)
exports.createSubCategory = async (req, res) => {
  try {
    const { album_id, images } = req.body; // images is an array of base64 encoded strings

    // Validate input
    if (!album_id || !images || images.length === 0) {
      return res.status(400).json({
        status: 400,
        msg: 'Album ID and at least one image are required',
      });
    }

    // Check if the album exists
    const album = await Album.findOne({ where: { album_id } });
    if (!album) {
      return res.status(404).json({
        status: 404,
        msg: 'Album not found',
      });
    }

    // Process each image and create a subcategory record for each image
    const subcategoryRecords = [];
    for (const image of images) {
      // Generate a unique subcategory_id for each record
      const subcategory_id = uuidv4();

      // Create a new subcategory record for each image
      const newSubCategory = await SubCategory.create({
        subcategory_id,
        album_id,      // Link to the album
        img: image,    // Base64 image string
        delete_at: 0,  // Default to not deleted
        created_date: new Date(),
      });

      subcategoryRecords.push(newSubCategory);
    }

    return res.status(201).json({
      status: 201,
      msg: 'Subcategories created successfully',
    });
  } catch (error) {
    console.error('Error creating subcategory:', error);
    return res.status(500).json({
      status: 500,
      msg: 'Internal server error',
      error: error.message,
    });
  }
};


// Soft Delete Subcategory
exports.softDeleteSubcategory = async (req, res) => {
    const { subcategory_id } = req.params;  // Get the subcategory_id from the request parameters
  
    try {
      // Find the subcategory to mark as deleted
      const subcategory = await SubCategory.findOne({
        where: { subcategory_id },
      });
  
      // Check if the subcategory exists
      if (!subcategory) {
        return res.status(404).json({
          status: 404,
          msg: 'Subcategory not found',
        });
      }
  
      // Update the delete_at field to mark it as deleted
      subcategory.delete_at = 1;
      await subcategory.save();
  
      return res.status(200).json({
        status: 200,
        msg: 'Subcategory marked as deleted successfully',
      });
    } catch (error) {
      console.error('Error marking subcategory as deleted:', error);
      return res.status(500).json({
        status: 500,
        msg: 'Internal server error',
        error: error.message,
      });
    }
  };
  