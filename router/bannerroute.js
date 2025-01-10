const express=require('express');
const router=express.Router();
const bannerController=require('../controller/bannercontroller');
const auth = require('../middleware/auth');
router.post("/createtitle",bannerController.createBanner);
router.put('/updatetitle/:banner_id',bannerController.updateBanner);
router.get('/getallbanner',bannerController.getBanners);

router.post('/createbimg',bannerController.createBannerImg);
router.get('/banner-images', bannerController.listBannerImgs);
router.delete('/banner-images/:banner_img_id', bannerController.deleteBannerImg);

module.exports=router;