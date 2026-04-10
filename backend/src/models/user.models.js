import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone_no: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["CUSTOMER", "VENDOR"]
    },
    refreshToken : {
        type: String
    }
}, { timestamps: true });


UserSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }
    
        this.password = await bcrypt.hash(this.password, 10);
        next()
    } catch (error) {
        console.log("Error in save 🛟");
    }
});



UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};


// Access Token
UserSchema.methods.createAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRED
        }
    );
};


// Refresh Token
UserSchema.methods.createRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRED
        }
    );
};

export const User = mongoose.model("User", UserSchema);