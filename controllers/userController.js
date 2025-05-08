import express from "express";
import bcrypt from "bcryptjs"; // Fixed typo: "bycript" -> "bcryptjs"
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import { getProductById, getProducts } from "../controllers/productController.js";
import generateToken from "../utils/generateToken.js";

const router = express.Router();

// Product routes
router.route("/").get(getProducts);
router.route("/:id").get(getProductById);

// User controller functions
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10); // Hash the password
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword, // Store hashed password
    });

    if (user) {
        const token = generateToken(res, user._id); // Generate token once
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token,
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password"); // Exclude passwords
    res.json(users);
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user, "user");

    if (user && (await bcrypt.compare(password, user.password))) {
        generateToken(res, user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("jwt"); // Assuming "jwt" is the cookie name
    res.json({ message: "Logged out" });
});

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        if (user.isAdmin) {
            res.status(400);
            throw new Error("You cannot delete an admin");
        }
        await User.deleteOne({ _id: user._id }); // Fixed typo: "deleteone" -> "deleteOne"
        res.json({ message: "User deleted successfully" }); // Fixed typo
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin; // Handle boolean properly
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt); // Hash new password
        }
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

export {
    registerUser,
    getUsers,
    loginUser,
    logoutUser,
    deleteUser,
    getUserById,
    updateUser,
    getUserProfile,
    updateUserProfile,
};