import Product from "../models/productModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import fs from 'fs';
import path from 'path'; // Explicitly import the path module
import { fileURLToPath } from 'url';
// @desc Fetch all products
// @route GET /api/products
// @access Public
export const getProducts = asyncHandler(async (req, res) => {
    const pageSize = process.env.PAGINATION_LIMIT;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: "i",
        },
    } : {};
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc Fetch single product
// @route GET /api/products/:id
// @access Public
export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

export const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: "Sample name",
        price: 0,
        user: req.user._id,
        image: "/images/sample.jpg",
        brand: "Sample brand",
        category: "Sample category",
        countInStock: 0,
        numReviews: 0,
        description: "Sample description",
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await Product.deleteOne({ _id: req.params.id });
        res.json({ message: "Product removed" });
    } else {    
        res.status(404);
        throw new Error("Product not found");
    }
});

export const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );
        if (alreadyReviewed) {
            res.status(400);
            throw new Error("Product already reviewed");
        }
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;
        await product.save();
        res.status(201).json({ message: "Review added" });
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

export const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);
    res.json(products);
});
// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload Product Image
export const uploadProductImage = asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400);
      throw new Error('No image file provided');
    }
  
    const imagePath = `/images/${req.file.filename}`; // Frontend serves this directly
  
    res.status(200).json({
      message: 'Image uploaded successfully',
      imagePath,
    });
  });
  
  // Update Product
  export const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, brand, category, countInStock, image } = req.body;
  
    const product = await Product.findById(req.params.id);
  
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
  
    // Update fields
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;
  
    // Update image path if provided
    if (image && image !== product.image) {
      if (product.image && product.image !== '/images/default-product.jpg') {
        const oldImagePath = path.join(__dirname, '..', '..', 'mern-front', 'public', 'images', path.basename(product.image));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      product.image = image;
    }
  
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  });