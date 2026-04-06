import mongoose from "mongoose";

const PlanSchema = mongoose.Schema({

    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    meal_type: {
        type: String,
        enum: ["VEG", "NON-VEG", "VEGAN"],
        default: "VEG",
        required: true
    }, 
    meal_time: {
        type: String,
        enum: ["BREAKFAST", "LUNCH", "DINNER"],
        required: true
    },
    duration_days: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    price_per_day: {
        type: Number,
        required: true
    },
    serving_size: {
        type: Number,
        default: 1,
        required: true
    },
    description: {
        type: String
    },
    general_menu: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    },
    payment_type: {
        type: String,
        enum: ["PREPAID", "POSTPAID"],
        required: true
    },
    cover_image: {
        type: String,
        default : "https://res.cloudinary.com/dsl55yufe/image/upload/v1775497800/j0qj62c43mi76z5h9w74.jpg"
    }


}, {timestamps: true})

export const Plan = mongoose.model('Plan', PlanSchema)