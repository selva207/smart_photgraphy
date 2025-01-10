const express=require('express');
const router=express.Router();
const about_uscontroller =require('../controller/about_uscontroller');
const auth = require('../middleware/auth');

router.post('/about-us', about_uscontroller.createAboutUs);
router.put('/about-us/:about_id', about_uscontroller.updateAboutUs);
router.get('/about-us', about_uscontroller.getAboutUsList);

module.exports=router;