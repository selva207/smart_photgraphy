const express = require('express');
const sequelize = require('./config/database');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const { Op } = require('sequelize'); // Assuming you're using Sequelize operators
const app = express();
const port = process.env.PORT || 5006;

app.use(cors());
app.use(bodyParser.json({ limit: '20mb' })); // Increased limit for large payloads
app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' })); // Increased limit for URL-encoded data
app.use(express.static("./public"));

app.use("/auth", require('./router/authroute'));
app.use("/user", require('./router/userroute'));
app.use("/banner", require('./router/bannerroute'));
app.use("/album", require('./router/albumroute'));
app.use("/aboutus", require('./router/about_usroute'));
app.use("/our_team", require('./router/our_teamroute'));
app.use("/portfolio", require('./router/portfolioroute'));


// Start the server
app.listen(port, () => {
  sequelize.sync({  })
    .then(() => {
      console.log(`Server is running on http://localhost:${port}`);
    })
    .catch(error => {
      console.error('Unable to sync the database:', error);
    });
  console.log(`Server listening on port ${port}`);
});