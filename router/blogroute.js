const express = require('express');
const router = express.Router();
const blogController = require('../controller/blogcontroller');  // Import your blog controller

// Route for creating a blog
router.post('/blog', blogController.createBlog);
router.put('/blog/:blog_id', blogController.updateBlog);
router.get('/blog', blogController.getAllBlogs);
router.delete('/blog/:blog_id', blogController.softDeleteBlog);

module.exports = router;
