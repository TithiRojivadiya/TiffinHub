import mongoose from "mongoose";

const SubscriptionSchema = mongoose.Schema({

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
    plan_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        required: true
    },
    start_date: {
        type: Date,
        default: Date.now,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    days_used: {
        type: Number,
        default: 0
    },
    extra_days_added: {
        type: Number,
        default: 0
    },
    total_amount: {
        type: Number
    },
    amount_paid: {
        type: Number,
        default: 0
    },
    outstanding_amount: {
        type: Number
    },
    payment_status: {
        type: String,
        enum: ["PAID", "PENDING", "PARTIAL"],
        default: "PENDING"
    },
    status: {
        type: String,
        enum: ["ACTIVE", "EXPIRED", "CANCELLED"],
        default: "ACTIVE"
    },
    pause_periods: [
        {
            from: Date,
            to: Date
        }
    ]


}, {timestamps: true})

export const Subscription = mongoose.model('Subscription', SubscriptionSchema)