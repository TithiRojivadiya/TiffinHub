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
    slug: { 
        type: String, 
        index: true
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
        enum: ["ACTIVE", "PAUSED", "DELETED"],
        default: "ACTIVE"
    },
    payment_type: {
        type: String,
        enum: ["PREPAID", "POSTPAID"],
        required: true,
        default: "PREPAID"
    },
    cover_image: {
        type: String,
        default : "https://res.cloudinary.com/dsl55yufe/image/upload/v1775497800/j0qj62c43mi76z5h9w74.jpg"
    },
    deletedAt: { 
        type: Date, 
        default: null 
    }


}, {timestamps: true})

PlanSchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '_')   // Replace spaces with underscore
    }
    next();
});

PlanSchema.index({ vendor_id: 1, slug: 1 }, { unique: true });

PlanSchema.index({ deletedAt: 1 }, { 
    expireAfterSeconds: 172800,
    partialFilterExpression: { deletedAt: { $type: "date" } } 
});

export const Plan = mongoose.model('Plan', PlanSchema)