import {
    registerUser, 
    getUsers, 
    loginUser, 
    logoutUser, 
    deleteUser, 
    getUserById,
    updateUser,
    getUserProfile,
    updateUserProfile,
} from "../controllers/userController.js";

import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express();
// protect болон admin гэсэн middleware-уудыг ашиглана
router.route("/").post(registerUser).get(protect, admin, getUsers);

router.post("/auth", loginUser);        // login хийх

router.post("/logout", logoutUser);     // logout хийх

router
    .route("/profile")
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router
    .route("/:id")
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser);

 export default router;