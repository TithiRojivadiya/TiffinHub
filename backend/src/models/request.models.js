import mongoose from "mongoose";

const RequestSchema = mongoose.Schema({

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
    message: {   
        type: String,        
        required: true
    },
    status: {           
        type: String,
        enum: ["PENDING", "ACCEPTED", "REJECTED"],
        default: "PENDING"
    }

}, {timestamps: true})

export const Request = mongoose.model('Request', RequestSchema)