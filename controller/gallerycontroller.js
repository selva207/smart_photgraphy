const Category = require('../model/gallery');
const Subcategory = require('../model/gallery_photo');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

exports.listCategories = async (req, res) => {
    try {
      const categories = await Category.findAll({
        where: { delete_at: 0 }, // Fetch only active categories (not soft deleted)
        order: [['created_at', 'DESC']], // Optional: Order by creation date
      });
  
      return res.status(200).json({
        status: 200,
        msg: 'Categories fetched successfully',
        data: categories,
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      return res.status(500).json({
        status: 500,
        msg: 'Internal server error',
        error: error.message,
      });
    }
  };
  

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ status: 400, msg: 'Category name is required' });
    }

    const newCategory = await Category.create({
      category_id: uuidv4(),
      name,
      delete_at: 0,
      created_at: new Date(),
    });

    return res.status(201).json({ status: 201, msg: 'Category created successfully', data: newCategory });
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({ status: 500, msg: 'Internal server error', error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
    try {
      const { category_id } = req.params;
      const { name } = req.body;
  
      // Check if the category exists
      const category = await Category.findOne({ where: { category_id } });
      if (!category) {
        return res.status(404).json({
          status: 404,
          msg: 'Category not found',
        });
      }
  
      // Update the category name
      await Category.update(
        {
          name: name || category.name,
        },
        { where: { category_id } }
      );
  
      return res.status(200).json({
        status: 200,
        msg: 'Category updated successfully',
      });
    } catch (error) {
      console.error('Error updating category:', error);
      return res.status(500).json({
        status: 500,
        msg: 'Internal server error',
        error: error.message,
      });
    }
  };
  
  exports.softDeleteCategory = async (req, res) => {
    try {
      const { category_id } = req.params;
  
      const category = await Category.findOne({ where: { category_id } });
      if (!category) {
        return res.status(404).json({
          status: 404,
          msg: 'Category not found',
        });
      }
  
      await Category.update(
        { delete_at: 1 }, // Mark as deleted
        { where: { category_id } }
      );
  
      return res.status(200).json({
        status: 200,
        msg: 'Category deleted successfully (soft delete)',
      });
    } catch (error) {
      console.error('Error soft deleting category:', error);
      return res.status(500).json({
        status: 500,
        msg: 'Internal server error',
        error: error.message,
      });
    }
  };

  //////////////////////////////////////////sub category ////////////////////////////////////////////////////////////////////

  exports.listSubcategories = async (req, res) => {
    const { category_id } = req.query; // Retrieve category_id from query parameters
  
    try {
      const whereClause = {
        delete_at: 0, // Fetch only active subcategories (not soft deleted)
      };
  
      // If category_id is provided, add it to the where clause to filter by category_id
      if (category_id) {
        whereClause.category_id = category_id;
      }
  
      const subcategories = await Subcategory.findAll({
        where: whereClause, // Apply the where clause with category_id filter
        include: [
          {
            model: Category,
            as: 'category', // Must match the alias in the association
            attributes: ['name'], // Include only the category name
          },
        ],
        order: [['created_date', 'DESC']], // Optional: Order by creation date
      });
  
      return res.status(200).json({
        status: 200,
        msg: 'Subcategories fetched successfully',
        data: subcategories,
      });
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      return res.status(500).json({
        status: 500,
        msg: 'Internal server error',
        error: error.message,
      });
    }
  };
  
  

// Setup multer for file upload
const multer = require('multer');

// Define storage path and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './controller/uploads'); // Adjust path as per your folder structure
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Create a unique filename
  }
});

const upload = multer({ storage: storage }).single('photo'); // Handle single photo

// Subcategory Creation API
exports.createSubcategory = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        msg: 'Error uploading photo',
        error: err.message,
      });
    }

    try {
      const { category_id } = req.body;
      let photo = null;

      // Check if a photo was uploaded
      if (req.file) {
        photo = req.file.filename; // Store path to the uploaded file
      }

      // Validate the required fields
      if (!category_id || !photo) {
        return res.status(400).json({
          status: 400,
          msg: 'Category ID and photo are required',
        });
      }

      // Generate a unique subcategory_id
      const subcategory_id = uuidv4();

      // Create a new subcategory
      const newSubcategory = await Subcategory.create({
        subcategory_id,
        category_id,
        photo,
        delete_at: 0, // Default to not deleted
        created_date: new Date(),
      });

      return res.status(201).json({
        status: 201,
        msg: 'Subcategory created successfully',
        data: newSubcategory,
      });
    } catch (error) {
      console.error('Error creating subcategory:', error);
      return res.status(500).json({
        status: 500,
        msg: 'Internal server error',
        error: error.message,
      });
    }
  });
};


exports.updateSubcategory = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          msg: 'Error uploading photo',
          error: err.message,
        });
      }
  
      try {
        const { subcategory_id } = req.params;
        const { category_id } = req.body;
        let photo = null;
  
        // Check if a new photo was uploaded
        if (req.file) {
          photo = req.file.filename;
        }
  
        // Check if the subcategory exists
        const subcategory = await Subcategory.findOne({ where: { subcategory_id } });
        if (!subcategory) {
          return res.status(404).json({
            status: 404,
            msg: 'Subcategory not found',
          });
        }
  
        // Check if the category exists (if updating category_id)
        if (category_id) {
          const category = await Category.findOne({ where: { category_id } });
          if (!category) {
            return res.status(400).json({
              status: 400,
              msg: 'Category ID does not exist',
            });
          }
        }
  
        // Update the subcategory details
        await Subcategory.update(
          {
            category_id: category_id || subcategory.category_id,
            photo: photo || subcategory.photo,
          },
          { where: { subcategory_id } }
        );
  
        return res.status(200).json({
          status: 200,
          msg: 'Subcategory updated successfully',
        });
      } catch (error) {
        console.error('Error updating subcategory:', error);
        return res.status(500).json({
          status: 500,
          msg: 'Internal server error',
          error: error.message,
        });
      }
    });
  };
  

  exports.softDeleteSubcategory = async (req, res) => {
    try {
      const { subcategory_id } = req.params;
  
      const subcategory = await Subcategory.findOne({ where: { subcategory_id } });
      if (!subcategory) {
        return res.status(404).json({
          status: 404,
          msg: 'Subcategory not found',
        });
      }
  
      await Subcategory.update(
        { delete_at: 1 }, // Mark as deleted
        { where: { subcategory_id } }
      );
  
      return res.status(200).json({
        status: 200,
        msg: 'Subcategory deleted successfully (soft delete)',
      });
    } catch (error) {
      console.error('Error soft deleting subcategory:', error);
      return res.status(500).json({
        status: 500,
        msg: 'Internal server error',
        error: error.message,
      });
    }
  };
  