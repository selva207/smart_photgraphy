const { v4: uuidv4 } = require('uuid');
const AboutUs = require('../model/about_us'); // Adjust the path based on your setup
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure 'uploads' folder inside 'controller' exists or create it
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up storage for the image (store files in 'controller/uploads' folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store uploaded files in 'controller/uploads' folder
  },
  filename: (req, file, cb) => {
    // Create a unique filename using UUID and the original file extension
    const uniqueName = uuidv4() + path.extname(file.originalname); 
    cb(null, uniqueName); // Save file with the unique name
  },
});

const upload = multer({ storage }).single('image'); // Expect form field name to be 'image'

// Get all About Us Entries (excluding soft-deleted ones)
exports.getAboutUsList = async (req, res) => {
    try {
      // Fetch all entries that are not soft-deleted (delete_at = 0)
      const aboutUsList = await AboutUs.findAll({
        where: {
          delete_at: 0, // Only fetch records that are not marked as deleted
        },
        attributes: ['id', 'about_id', 'title', 'content', 'content_1', 'point_1', 'point_2', 'point_3', 'title_1', 'content_2', 'image', 'created_date'], // Specify the fields to return
        order: [['created_date', 'DESC']], // Sort by created_date (most recent first)
      });
  
      // If no entries found
      if (!aboutUsList.length) {
        return res.status(404).json({
          status: 404,
          msg: 'No About Us entries found',
        });
      }
  
      // Return the list of "About Us" entries
      return res.status(200).json({
        status: 200,
        msg: 'About Us entries retrieved successfully',
        data: aboutUsList,
      });
    } catch (error) {
      console.error('Error retrieving About Us entries:', error);
      return res.status(500).json({
        status: 500,
        msg: 'Internal server error',
        error: error.message,
      });
    }
  };
  

// Create About Us Entry
exports.createAboutUs = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        msg: 'Error uploading image',
        error: err.message,
      });
    }

    try {
      const { title, content, content_1, point_1, point_2, point_3, title_1, content_2 } = req.body;
      let image = null;

      // Check if image was uploaded
      if (req.file) {
        image = req.file.filename; // Store the unique image filename
      }

      // Validate required fields
      if (!title || !content) {
        return res.status(400).json({
          status: 400,
          msg: 'Title and Content are required',
        });
      }

      // Generate a unique about_id
      const about_id = uuidv4();

      // Create a new "About Us" entry
      const newAboutUs = await AboutUs.create({
        about_id,         // Unique about_us identifier
        title,
        content,
        content_1,
        point_1,
        point_2,
        point_3,
        title_1,
        content_2,
        image,            // Store the unique image filename
        delete_at: 0,     // Default to not deleted
        created_date: new Date(),
      });

      return res.status(201).json({
        status: 201,
        msg: 'About Us entry created successfully',
      });
    } catch (error) {
      console.error('Error creating About Us entry:', error);
      return res.status(500).json({
        status: 500,
        msg: 'Internal server error',
        error: error.message,
      });
    }
  });
};


// Update About Us Entry
exports.updateAboutUs = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          msg: 'Error uploading image',
          error: err.message,
        });
      }
  
      try {
        const { about_id } = req.params; // Use the about_id passed in the URL params
        const { title, content, content_1, point_1, point_2, point_3, title_1, content_2 } = req.body;
        let image = null;
  
        // Find the existing "About Us" entry
        const aboutUsEntry = await AboutUs.findOne({ where: { about_id } });
  
        if (!aboutUsEntry) {
          return res.status(404).json({
            status: 404,
            msg: 'About Us entry not found',
          });
        }
  
        // If a new image is uploaded, update the image field
        if (req.file) {
          // Optionally: Delete the old image from the server
          if (aboutUsEntry.image) {
            const oldImagePath = path.join(__dirname, 'uploads', aboutUsEntry.image);
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath); // Remove the old image file
            }
          }
  
          image = req.file.filename; // Set the new image filename
        }
  
        // Update the "About Us" entry fields
        aboutUsEntry.title = title || aboutUsEntry.title;
        aboutUsEntry.content = content || aboutUsEntry.content;
        aboutUsEntry.content_1 = content_1 || aboutUsEntry.content_1;
        aboutUsEntry.point_1 = point_1 || aboutUsEntry.point_1;
        aboutUsEntry.point_2 = point_2 || aboutUsEntry.point_2;
        aboutUsEntry.point_3 = point_3 || aboutUsEntry.point_3;
        aboutUsEntry.title_1 = title_1 || aboutUsEntry.title_1;
        aboutUsEntry.content_2 = content_2 || aboutUsEntry.content_2;
        if (image) {
          aboutUsEntry.image = image; // Update the image if a new one was uploaded
        }
  
        // Save the updated entry
        await aboutUsEntry.save();
  
        return res.status(200).json({
          status: 200,
          msg: 'About Us entry updated successfully',
        });
      } catch (error) {
        console.error('Error updating About Us entry:', error);
        return res.status(500).json({
          status: 500,
          msg: 'Internal server error',
          error: error.message,
        });
      }
    });
  };
  