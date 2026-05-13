import mongoose from "mongoose";

const SubscriptionSchema = mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
        required: true
    },
    start_date: {  // of plan 
        type: Date,
        default: Date.now,
        required: true
    },
    end_date: { // of plan
        type: Date,
        required: true
    },
    days_consumed: {
        type: Number,
        default: 0
    },
    value_consumed: {
        type: Number
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
    status: {   // of service
        type: String,
        enum: ["ACTIVE", "EXPIRED", "CANCELLED", "PAUSED"],
        default: "ACTIVE"
    },
    cancelled_at: {
        type: Date
    },
    pause_periods: [
        {
            from: Date,
            to: Date
        }
    ]

}, {timestamps: true})

export const Subscription = mongoose.model('Subscription', SubscriptionSchema)