const express = require('express');
const router = express.Router();
const portfolioController = require('../controller/portfoliocontroller');
const auth = require('../middleware/auth');

router.post('/portfolio', portfolioController.createPortfolio); // Route for creating a portfolio
router.get('/portfolio', portfolioController.listPortfolios); // Route for creating a portfolio
router.delete('/portfolio/:portfolio_id', portfolioController.softDeletePortfolio);

module.exports = router;
