import express from "express";
import {protect, admin} from "../middleware/authMiddleware.js";
import {
    addOrderItems, 
    getMyOrders, 
    getOrderById, 
    getOrders, 
    addShippingAddress,
    addPaymentMethod,
    placeOrder,
    // updateOrder, 
    // updateOrderToDelivered, 
    // updateOrderToPaid, 
    deleteOrder
} from "../controllers/orderController.js";

const router = express.Router();

router.route("/").get(protect, admin, getOrders).post(protect, addOrderItems);
router.route("/myorders").get(protect, getMyOrders);
router.route("/shipping").post(protect, addShippingAddress);
router.route("/payment").post(protect, addPaymentMethod);
router.route("/placeorder").post(protect, placeOrder);

// router.route("/:id/pay").put(protect, updateOrderToPaid);
// router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

router
    .route("/:id")
    .delete(protect, admin, deleteOrder)
    .get(protect, admin, getOrderById)
    // .put(protect, admin, updateOrder);

export default router;  