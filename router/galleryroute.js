const express = require('express');
const router = express.Router();
const galleryController = require('../controller/gallerycontroller');

router.get('/category', galleryController.listCategories);
router.post('/category', galleryController.createCategory);
router.put('/category/:category_id', galleryController.updateCategory);
router.delete('/category/:category_id', galleryController.softDeleteCategory);

router.get('/subcategory/:category_id', galleryController.listSubcategories);
router.post('/subcategory', galleryController.createSubcategory);
router.put('/subcategory/:subcategory_id', galleryController.updateSubcategory);
router.delete('/subcategory/:subcategory_id', galleryController.softDeleteSubcategory);

module.exports = router;
