const jwt = require('jsonwebtoken');
const { blacklistedTokens } = require('../controller/authController');

// Your secret key for verifying the JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Ensure this matches the key used in your `login` function

const auth = (req, res, next) => {
  // Get the token from headers
  const token = req.headers['authorization'];// Expecting the token to be in the form of "Bearer <token>"
   
  if (token == null) return res.status(400).json({ status:400, msg: 'No token provided' });

  if(blacklistedTokens.has(token)){
    return res.status(404).send({status:404,msg:"Token is Block Listed"})
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ status:403,msg: 'Invalid token' });

    req.user = user;// Attach user info to the request
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = auth;
