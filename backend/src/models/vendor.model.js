import mongoose from "mongoose";

const VendorSchema = mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    business_name: {
        type: String,
        required: true
    },
    delivery_start_time: {
        type: String
    },
    delivery_end_time: {
        type: String
    }
    

},{timestamps: true})

export const Vendor = mongoose.model('Vendor', VendorSchema)