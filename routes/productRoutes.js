import express from "express";
import {protect, admin} from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
    getProducts,
    createProduct,
    createProductReview,
    getTopProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    uploadProductImage,
} from "../controllers/productController.js";
const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.route("/:id/reviews").post(protect, createProductReview);
router.get("/top", getTopProducts);

router.post("/upload", 
    protect,
    admin, 
    upload.single('image'), 
    uploadProductImage
  );

router
    .route("/:id")
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

export default router;