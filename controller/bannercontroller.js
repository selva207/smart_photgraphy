const Banner = require("../model/banner");
const Banner_img = require("../model/banner_img");
const multer = require('multer'); // Import multer
const { v4: uuidv4 } = require("uuid");
const storage = multer.memoryStorage(); // You can also store the file in disk if preferred
const upload = multer({ storage });

exports.getBanners = async (req, res) => {
    try {
      // Fetch all banners (you can add conditions or filters as needed)
      const banners = await Banner.findAll({
        where: {
          delete_at: 0, // Only fetch banners that are not deleted (soft delete)
        },
        order: [['created_date', 'DESC']], // Sort by created_date in descending order
      });
  
      return res.status(200).json({
        status: 200,
        msg: 'Banners retrieved successfully',
        data: banners, // The list of banners
      });
    } catch (error) {
      console.error('Error retrieving banners:', error);
      return res.status(500).json({
        status: 500,
        msg: 'Internal server error',
        error: error.message,
      });
    }
  };

exports.createBanner = async (req, res) => {
  try {
    const { title } = req.body;

    // Validate the input
    if (!title) {
      return res.status(400).json({
        status: 400,
        msg: 'Title is required',
      });
    }

    // Generate a unique banner_id using UUID
    const banner_id = uuidv4();

    // Create a new banner
    const newBanner = await Banner.create({
      banner_id, // Use the generated UUID as the banner_id
      title,
      delete_at: 0, // Ensure delete_at is set to 0 (not deleted)
      created_date: new Date(), // Automatically sets the creation date
    });

    return res.status(201).json({
      status: 201,
      msg: 'Banner created successfully',
      data: newBanner, // The created banner
    });
  } catch (error) {
    console.error('Error creating banner:', error);
    return res.status(500).json({
      status: 500,
      msg: 'Internal server error',
      error: error.message,
    });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const { banner_id } = req.params; // Get banner_id from the URL
    const { title } = req.body; // Get the title from the request body

    // Validate the input
    if (!title) {
      return res.status(400).json({
        status: 400,
        msg: 'Title is required',
      });
    }

    // Find the banner by banner_id
    const banner = await Banner.findOne({ where: { banner_id } });

    // Check if banner exists
    if (!banner) {
      return res.status(404).json({
        status: 404,
        msg: 'Banner not found',
      });
    }

    // Update the banner's title
    await banner.update({ title });

    return res.status(200).json({
      status: 200,
      msg: 'Banner updated successfully',
      data: banner, // The updated banner
    });
  } catch (error) {
    console.error('Error updating banner:', error);
    return res.status(500).json({
      status: 500,
      msg: 'Internal server error',
      error: error.message,
    });
  }
};


/////////////////////////////////////////////// BANNER IMAGE ////////////////////////////////////////////////////////////////////////////

exports.listBannerImgs = async (req, res) => {
  try {
    // Fetch all banner images that are not deleted
    const bannerImgs = await Banner_img.findAll({
      where: {
        delete_at: 0, // Ensure we're only fetching non-deleted images
      },
      order: [['created_date', 'DESC']], // Order by created_date descending (newest first)
    });

    // Respond with the banner images
    return res.status(200).json({
      status: 200,
      msg: 'Banner images retrieved successfully',
      data: bannerImgs, // Send all banner images
    });
  } catch (error) {
    console.error('Error retrieving banner images:', error);
    return res.status(500).json({
      status: 500,
      msg: 'Internal server error',
      error: error.message,
    });
  }
};


exports.createBannerImg = [
  upload.single('img'), // Expecting 'img' as the form field name for the image
  async (req, res) => {
    try {
      const file = req.file;

      // Validate that the image file exists
      if (!file) {
        return res.status(400).json({
          status: 400,
          msg: 'Image file is required',
        });
      }

      // Generate a unique banner_img_id using UUID
      const banner_img_id = uuidv4();

      // Assuming you want to save the image as a buffer or upload it to a storage service
      const imgBuffer = file.buffer;

      // Example: Convert the image to base64 or store it using a cloud service like S3 or a local filesystem

      // Create a new banner image record in the database (assuming you have a Banner_img model)
      const newBannerImg = await Banner_img.create({
        banner_img_id,
        img: imgBuffer.toString('base64'), // If you want to store base64 strings
        delete_at: 0, // Ensure delete_at is set to 0 (not deleted)
        created_date: new Date(), // Automatically sets the creation date
      });

      return res.status(201).json({
        status: 201,
        msg: 'Banner image created successfully',
      });
    } catch (error) {
      console.error('Error creating banner image:', error);
      return res.status(500).json({
        status: 500,
        msg: 'Internal server error',
        error: error.message,
      });
    }
  }
];


exports.deleteBannerImg = async (req, res) => {
  try {
    const { banner_img_id } = req.params;

    // Check if the banner image exists and is not already deleted
    const bannerImg = await Banner_img.findOne({
      where: {
        banner_img_id,
        delete_at: 0, // Only fetch if it's not already deleted
      },
    });

    if (!bannerImg) {
      return res.status(404).json({
        status: 404,
        msg: 'Banner image not found or already deleted',
      });
    }

    // Perform the soft delete by updating the delete_at field to 1
    await Banner_img.update(
      { delete_at: 1 }, // Mark as deleted
      {
        where: {
          banner_img_id,
        },
      }
    );

    return res.status(200).json({
      status: 200,
      msg: 'Banner image deleted successfully (soft delete)',
    });
  } catch (error) {
    console.error('Error deleting banner image:', error);
    return res.status(500).json({
      status: 500,
      msg: 'Internal server error',
      error: error.message,
    });
  }
};
