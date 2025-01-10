const { v4: uuidv4 } = require('uuid');
const Portfolio = require('../model/portfolio');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure 'uploads' folder exists or create it
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // Create folder if it doesn't exist
}

// Set up multer storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // Store uploaded files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);  // Use timestamp to avoid name collisions
  },
});

const upload = multer({ storage }).single('images'); // Expect the form field name to be 'images'


// List portfolios (filtered by delete_at = 0, and optional query params for pagination/filter)
exports.listPortfolios = async (req, res) => {
  try {


    // Fetch portfolios where delete_at = 0 (not deleted), with pagination
    const portfolios = await Portfolio.findAll({
      where: { delete_at: 0 },
    });

    return res.status(200).json({
      status: 200,
      msg: 'Portfolios fetched successfully',
      data: portfolios,
    });
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    return res.status(500).json({
      status: 500,
      msg: 'Internal server error',
      error: error.message,
    });
  }
};


// Create Portfolio (Handling FormData)
exports.createPortfolio = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        msg: 'Error uploading image',
        error: err.message,
      });
    }

    try {
      // Get the image file from FormData
      const { images } = req.body;  // FormData image (base64 or file path)
      let imageFilePath = null;

      // If an image is uploaded via FormData, get the path
      if (req.file) {
        imageFilePath = req.file.filename;  // Store image path in database
      }

      // Validate input (images are required)
      if (!images && !imageFilePath) {
        return res.status(400).json({
          status: 400,
          msg: 'Image is required',
        });
      }

      // Generate a unique portfolio_id
      const portfolio_id = uuidv4();  // Unique identifier for portfolio

      // Create a new portfolio entry in the database
      const newPortfolio = await Portfolio.create({
        portfolio_id,   // Unique identifier for the portfolio
        images: imageFilePath,  // Store the image path or base64 string
        delete_at: 0,   // Default to not deleted
        created_date: new Date(),
      });

      return res.status(201).json({
        status: 201,
        msg: 'Portfolio created successfully',
        data: newPortfolio,
      });
    } catch (error) {
      console.error('Error creating portfolio:', error);
      return res.status(500).json({
        status: 500,
        msg: 'Internal server error',
        error: error.message,
      });
    }
  });
};


// Soft Delete Portfolio (by setting delete_at = 1)
exports.softDeletePortfolio = async (req, res) => {
  const { portfolio_id } = req.params;  // Get the portfolio_id from the request params

  try {
    // Check if portfolio exists
    const portfolio = await Portfolio.findOne({ where: { portfolio_id } });

    if (!portfolio) {
      return res.status(404).json({
        status: 404,
        msg: 'Portfolio not found',
      });
    }

    // Soft delete by setting delete_at to 1
    await Portfolio.update({ delete_at: 1 }, { where: { portfolio_id } });

    return res.status(200).json({
      status: 200,
      msg: 'Portfolio marked as deleted successfully',
    });
  } catch (error) {
    console.error('Error soft deleting portfolio:', error);
    return res.status(500).json({
      status: 500,
      msg: 'Internal server error',
      error: error.message,
    });
  }
};
