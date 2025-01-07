const bcrypt = require('bcrypt');
const  User  = require('../model/user');
const { UniqueConstraintError, ValidationError } = require('sequelize');
const { v4: uuidv4 } = require('uuid'); // Import UUID package

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


