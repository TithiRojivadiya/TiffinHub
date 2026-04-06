import mongoose from "mongoose";

const DeliverySchema = mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    subscription_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    quantity: {
        type: Number,
        default: 1
    },
    status: {
        type: String,
        enum: ["PENDING", "DELIVERED"],
        default: "PENDING"
    }

}, {timestamps: true})

export const Delivery = mongoose.model('Delivery', DeliverySchema)