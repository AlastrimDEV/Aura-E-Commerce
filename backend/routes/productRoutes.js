const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware.js");
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/productController.js");
const multer = require("multer");
const upload = multer({ dest: 'uploads/'})

const router = express.Router();


router.route('/').get(getProducts).post(protect, admin, upload.single('image'), createProduct);
router.route("/:id").get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);



module.exports = router;