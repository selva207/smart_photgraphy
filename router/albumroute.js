const express=require('express');
const router=express.Router();
const albumController=require('../controller/albumcontroller');
const albumimgController = require('../controller/albumimgcontroller');
const auth = require('../middleware/auth');

router.post('/albums', albumController.createAlbum); // Create a new album
router.get('/albums', albumController.getAllAlbums);   // List all albums
router.put('/albums', albumController.updateAlbum);
router.delete('/albums', albumController.softDeleteAlbum);


router.post('/albums-img', albumimgController.createSubCategory); // Create a new album
router.get('/albums/:album_id',albumimgController.listSubcategoriesForAlbum);
router.delete('/albums/:subcategory_id',albumimgController.softDeleteSubcategory);

module.exports=router;