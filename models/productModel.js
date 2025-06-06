import mongoose from "mongoose";
const reviewSchema = mongoose.Schema(
    {
        name: { type: String, required: true},
        rating: { type: Number, required: true},
        comment: { type: String, required: true},
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
)

const productsModel = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String, 
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        reviews: [reviewSchema],
        rating: {
            type: Number,
            required: true,
            default: 0,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        reviews: [reviewSchema],
        rate: {
            type: Number,
            required: true,
            default: 0,
        },
        numReviews: {
            type: String,
            required: true,
            default: 0,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        countInStock: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
)

const Model = mongoose.model("Model", productsModel);
export default Model;