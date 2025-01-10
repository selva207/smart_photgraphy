const { v4: uuidv4 } = require('uuid');
const Blog = require('../model/blog'); // Import the Blog model
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure 'uploads' folder exists or create it
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // Create folder if it doesn't exist
}

// Set up storage for the blog photo (store files in 'uploads' folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store uploaded files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp to avoid name collisions
  },
});

const upload = multer({ storage }).single('photo'); // Expect the form field name to be 'photo'

// Listing API for Blogs
exports.getAllBlogs = async (req, res) => {
    try {
      const blogs = await Blog.findAll({
        where: {
          delete_at: 0,  // Fetch only active blogs, change to 1 to fetch soft deleted ones
        },
      });
  
      return res.status(200).json({
        status: 200,
        msg: 'Blogs fetched successfully',
        data: blogs,
      });
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return res.status(500).json({
        status: 500,
        msg: 'Internal server error',
        error: error.message,
      });
    }
  };
  

// Blog creation controller
exports.createBlog = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        msg: 'Error uploading photo',
        error: err.message,
      });
    }

    try {
      const { news, date, author_name } = req.body;
      let photo = null;

      // Check if photo was uploaded
      if (req.file) {
        // If a file is uploaded, get the path and assign it to photo
        photo = req.file.filename; // Store path to the uploaded file
      }

      // Validate input
      if (!news || !date || !author_name) {
        return res.status(400).json({
          status: 400,
          msg: 'All fields (news, date, and author_name) are required',
        });
      }

      // Generate a unique blog_id
      const blog_id = uuidv4(); // You can use any other logic to generate a unique ID

      // Create a new blog
      const newBlog = await Blog.create({
        blog_id,        // Unique blog identifier
        photo,          // Photo path
        news,           // News content
        date,           // Date of the blog
        author_name,    // Author name
        delete_at: 0,   // Default to not deleted
        created_date: new Date(),
      });

      return res.status(201).json({
        status: 201,
        msg: 'Blog created successfully',
        data: newBlog,
      });
    } catch (error) {
      console.error('Error creating blog:', error);
      return res.status(500).json({
        status: 500,
        msg: 'Internal server error',
        error: error.message,
      });
    }
  });
};


exports.updateBlog = async (req, res) => {
    const blogId = req.params.blog_id; // Get the blog ID from the route parameter
  
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          msg: 'Error uploading photo',
          error: err.message,
        });
      }
  
      try {
        const { news, date, author_name } = req.body;
        let photo = null;
  
        // Check if photo was uploaded
        if (req.file) {
          // If a file is uploaded, get the path and assign it to photo
          photo = req.file.filename; // Store path to the uploaded file
  
          // Optionally: If you want to delete the old image from the uploads folder, you can fetch the old record and remove the old image file
          const blog = await Blog.findOne({ where: { blog_id: blogId } });
          if (blog && blog.photo) {
            const oldImagePath = path.join(uploadDir, blog.photo);
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath); // Delete the old image file
            }
          }
        }
  
        // Find the blog by its ID
        const blog = await Blog.findOne({ where: { blog_id: blogId } });
        if (!blog) {
          return res.status(404).json({
            status: 404,
            msg: 'Blog not found',
          });
        }
  
        // Update the blog's data
        const updatedBlog = await Blog.update(
          {
            news: news || blog.news, // If the news is provided, update it, otherwise keep the existing
            date: date || blog.date, // If the date is provided, update it, otherwise keep the existing
            author_name: author_name || blog.author_name, // If the author_name is provided, update it, otherwise keep the existing
            photo: photo || blog.photo, // If a new photo is uploaded, update it, otherwise keep the existing
          },
          { where: { blog_id: blogId } } // Update based on the blog's ID
        );
  
        return res.status(200).json({
          status: 200,
          msg: 'Blog updated successfully',
        });
      } catch (error) {
        console.error('Error updating blog:', error);
        return res.status(500).json({
          status: 500,
          msg: 'Internal server error',
          error: error.message,
        });
      }
    });
  };

  // Soft Delete API for Blog
exports.softDeleteBlog = async (req, res) => {
    const blogId = req.params.blog_id; // Get the blog ID from the route parameter
  
    try {
      // Find the blog by its ID
      const blog = await Blog.findOne({ where: { blog_id: blogId } });
  
      if (!blog) {
        return res.status(404).json({
          status: 404,
          msg: 'Blog not found',
        });
      }
  
      // Soft delete the blog by updating 'delete_at' field
      const updatedBlog = await Blog.update(
        { delete_at: 1 }, // Set delete_at to 1 to mark it as deleted
        { where: { blog_id: blogId } }
      );
  
      return res.status(200).json({
        status: 200,
        msg: 'Blog soft deleted successfully',
      });
    } catch (error) {
      console.error('Error soft deleting blog:', error);
      return res.status(500).json({
        status: 500,
        msg: 'Internal server error',
        error: error.message,
      });
    }
  };
  