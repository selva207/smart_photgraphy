const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
  port:3306,
  pool: {
    max: 20, // Increase max connections
    min: 5,  // Minimum connections
    acquire: 30000, // Increase timeout
    idle: 10000,
  }
});
 
module.exports = sequelize; 