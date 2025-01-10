const bcrypt = require('bcrypt');
const  User  = require('../model/user');
const { UniqueConstraintError, ValidationError } = require('sequelize');
const { v4: uuidv4 } = require('uuid'); // Import UUID package

exports.getUsers = async (req, res) => {
  try {
    // Fetch all users without any conditions (no sorting, pagination, or filtering)
    const users = await User.findAll();

    return res.status(200).json({
      status: 200,
      msg: 'Users retrieved successfully',
      data: users, // The list of users
    });
  } catch (error) {
    console.error('Error retrieving users:', error);
    return res.status(500).json({ status: 500, msg: 'Internal server error', error: error.message });
  }
};


exports.createUser = async (req, res) => {
  const { name, phone_number, password, delete_at } = req.body;

  if (!password) {
    return res.status(400).json({ msg: 'Password is required' });
  }

  try {
    // Generate unique user_id using UUID
    const user_id = uuidv4();

    // Hash the password with salt rounds
    const saltRounds = 10; // Set the number of salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);  // Properly passing both data and salt

    // Create new user
    const newUser = await User.create({
      user_id,          // Generated unique user_id
      name,             // Provided name
      phone_number,     // Provided phone_number
      password: hashedPassword,  // Hashed password
      delete_at: delete_at || 0, // Default to 0 (not deleted)
      created_date: new Date() // Automatically set current date/time as created_date
    });

    return res.status(200).json({ status: 200, msg: "User created successfully", newUser });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return res.status(400).json({ msg: 'Unique constraint error', details: error.errors.map(e => e.message) });
    }
    if (error instanceof ValidationError) {
      return res.status(400).json({
        status: 400,
        msg: 'Validation error',
        errors: error.errors.map(err => ({
          message: err.message,
          field: err.path,
        })),
      });
    }
    console.error('Error creating user:', error); // Log full error for debugging
    return res.status(500).json({ status: 500, msg: 'Internal server error', error: error.message });
  }
};


exports.updateUser = async (req, res) => {
  const { user_id } = req.params;
  const { name, phone_number, password } = req.body;

  try {
    // Find the user by user_id
    const user = await User.findOne({ where: { user_id } });
    console.log("Received user_id:", user_id); 

    if (!user) {
      return res.status(404).json({ status: 404, msg: "User not found" });
    }

    // Prepare an object to hold updated data
    const updatedData = {};

    // Only update provided fields
    if (name) updatedData.name = name;
    if (phone_number) updatedData.phone_number = phone_number;

    // If password is provided, hash it
    if (password) {
      const saltRounds = 10;
      updatedData.password = await bcrypt.hash(password, saltRounds);
    }

    // Update only allowed fields, excluding user_id
    await user.update(updatedData);

    return res.status(200).json({ status: 200, msg: "User updated successfully", user });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        status: 400,
        msg: 'Validation error',
        errors: error.errors.map(err => ({
          message: err.message,
          field: err.path,
        })),
      });
    }
    console.error('Error updating user:', error);
    return res.status(500).json({ status: 500, msg: 'Internal server error', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    // Find the user by user_id
    const user = await User.findOne({ where: { user_id } });

    if (!user) {
      return res.status(404).json({ status: 404, msg: "User not found" });
    }

    // Mark the user as deleted by updating the `delete_at` field
    user.delete_at = 1; // Mark as deleted
    await user.save(); // Save the changes

    return res.status(200).json({
      status: 200,
      msg: 'User marked as deleted successfully',
      user, // Return the updated user object
    });
  } catch (error) {
    console.error('Error marking user as deleted:', error);
    return res.status(500).json({ status: 500, msg: 'Internal server error', error: error.message });
  }
};
