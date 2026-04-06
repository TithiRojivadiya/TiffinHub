import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'

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

}, {timestamps: true})

UserSchema.pre('save', async function(next){
    if(!this.isModified(this.password)){
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

UserSchema.methods.isPasswordCorrect = async function(password) {

    return await bcrypt.compare(password, this.password)
    
}

UserSchema.methods.createAccessToken = async function() {
    jwt.sign(
        {   // payload
            _id : this._id,
            username : this.username,
            email : this.email,
            role : this.role
        },
        process.env.ACCESS_TOKEN_SECRET, 
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRED
        }
    )
}

UserSchema.methods.createRefreshToken = async function() {
    jwt.sign(
        {   // payload
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET, 
        {
            expiresIn : process.env.REFESH_TOKEN_EXPIRED
        }
    )
}

export const User = mongoose.model('User', UserSchema)