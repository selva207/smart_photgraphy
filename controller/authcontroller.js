const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const { Op } = require("sequelize");

exports.blacklistedTokens = new Set();

const blacklistToken = (token) => {
  this.blacklistedTokens.add(token);
};

const JWT_SECRET = "your_secret_key"; // Replace this with your actual secret key

exports.login = async (req, res) => {
  try {
    const { phone_number, password } = req.body;

    // Find the user by either login_id or phone_number
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { phone_number: phone_number || null }  // Use null if phone_number is not provided
        ]
      }
    });

    if (!user) {
      return res.status(404).json({status:404, msg: "User not found" });
    }

    // Compare the plain-text password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ status:400, msg: "Invalid credentials" });
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: user.user_id, username: user.user_name }, // Payload
      JWT_SECRET, // Secret key from environment variables
      { expiresIn: "7d" } // Token expiration time
    );

    res.status(200).json({
      status: 200,
      msg: "Login successful",
      user,
      token, // Send the token in the response
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({ status:500,msg: "Error logging in", error });
  }
};

exports.logout = async (req, res) => {
  try {
    // Extract token from request headers
    const token = req.headers.authorization;

    if (token) {
      // Blacklist the token (if using token blacklisting)
      blacklistToken(token);
    }
    console.log("black", this.blacklistedTokens);
    res.status(200).json({
      status: 200,
      msg: "Logout successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error logging out", error });
  }
};
