import mongoose, { model } from "mongoose";

const ExtraOrderSchema = mongoose.Schema({

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
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["REQUESTED", "ACCEPTED", "REJECTED", "DELIVERED"],
        default: "REQUESTED"
    }

},{timestamps: true})

export const ExtraOrder = mongoose.model('ExtraOrder', ExtraOrderSchema)