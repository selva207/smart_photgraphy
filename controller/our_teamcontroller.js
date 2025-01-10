const { v4: uuidv4 } = require('uuid');
const OurTeam = require('../model/our_team'); // Adjust the path
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure 'uploads' folder exists or create it
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // Create folder if it doesn't exist
}

// Set up storage for the image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store uploaded files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname); // Create a unique file name
    cb(null, uniqueName); // Save the file with the unique name
  },
});

const upload = multer({ storage }).single('image'); // Expect the form field name to be 'image'

// List all team members
exports.listTeamMembers = async (req, res) => {
    try {
      // Fetch all team members from the database
      const teamMembers = await OurTeam.findAll({
        where: { delete_at: 0 },  // Only get non-deleted team members
        attributes: ['id', 'our_team_id', 'name', 'role', 'image', 'created_date'],  // Only the necessary columns
      });
  
      // If no team members are found
      if (teamMembers.length === 0) {
        return res.status(404).json({
          status: 404,
          msg: 'No team members found',
        });
      }
  
      return res.status(200).json({
        status: 200,
        msg: 'Team members retrieved successfully',
        data: teamMembers,
      });
    } catch (error) {
      console.error('Error fetching team members:', error);
      return res.status(500).json({
        status: 500,
        msg: 'Internal server error',
        error: error.message,
      });
    }
  };
  

// Create Team Member with image upload
exports.createTeamMember = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        msg: 'Error uploading image',
        error: err.message,
      });
    }

    try {
      const { name, role } = req.body;
      let image = null;

      // Check if image was uploaded
      if (req.file) {
        // If a file is uploaded, get the path and assign it to image
        image = req.file.filename; // Store the image file name
      }

      // Validate input
      if (!name || !role) {
        return res.status(400).json({
          status: 400,
          msg: 'Name and Role are required',
        });
      }

      // Generate a unique our_team_id
      const our_team_id = uuidv4();

      // Create a new team member
      const newTeamMember = await OurTeam.create({
        our_team_id,  // Unique team member identifier
        name,
        role,
        image,        // Store the image file name
        delete_at: 0, // Default to not deleted
        created_date: new Date(),
      });

      return res.status(201).json({
        status: 201,
        msg: 'Team member created successfully',
        data: newTeamMember,
      });
    } catch (error) {
      console.error('Error creating team member:', error);
      return res.status(500).json({
        status: 500,
        msg: 'Internal server error',
        error: error.message,
      });
    }
  });
};


exports.updateTeamMember = async (req, res) => {
    const teamMemberId = req.params.our_team_id; // Get the team member's ID from URL
  
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          msg: 'Error uploading image',
          error: err.message,
        });
      }
  
      try {
        const { name, role } = req.body;
        let image = null;
  
        // Check if a new image was uploaded
        if (req.file) {
          image = req.file.filename; // Store the new image file name
  
          // Optionally: delete old image from 'uploads' folder
          const teamMember = await OurTeam.findOne({ where: { our_team_id: teamMemberId } });
          if (teamMember && teamMember.image) {
            const oldImagePath = path.join(uploadDir, teamMember.image);
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath); // Delete the old image file
            }
          }
        }
  
        // Check if the team member exists
        const teamMember = await OurTeam.findOne({ where: { our_team_id: teamMemberId } });
        if (!teamMember) {
          return res.status(404).json({
            status: 404,
            msg: 'Team member not found',
          });
        }
  
        // Update the team member's data
        await teamMember.update({
          name: name || teamMember.name,
          role: role || teamMember.role,
          image: image || teamMember.image,
        });
  
        return res.status(200).json({
          status: 200,
          msg: 'Team member updated successfully',
          data: teamMember,
        });
      } catch (error) {
        console.error('Error updating team member:', error);
        return res.status(500).json({
          status: 500,
          msg: 'Internal server error',
          error: error.message,
        });
      }
    });
  };
  

  exports.softDeleteTeamMember = async (req, res) => {
    const teamMemberId = req.params.our_team_id; // Get the team member ID from the URL params
  
    try {
      // Find the team member based on 'our_team_id'
      const teamMember = await OurTeam.findOne({
        where: { our_team_id: teamMemberId },
      });
  
      // If the team member does not exist, return a 404 response
      if (!teamMember) {
        return res.status(404).json({
          status: 404,
          msg: 'Team member not found',
        });
      }
  
      // Soft delete: Update 'delete_at' column to 1
      await teamMember.update({ delete_at: 1 });
  
      return res.status(200).json({
        status: 200,
        msg: 'Team member soft deleted successfully',
      });
    } catch (error) {
      console.error('Error soft deleting team member:', error);
      return res.status(500).json({
        status: 500,
        msg: 'Internal server error',
        error: error.message,
      });
    }
  };
  