import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Vendor } from "../models/vendor.model.js"

let generateAccessAndRefreshToken = async (userId) => {

    try {

        const user = await User.findById(userId)
        const accessToken = user.createAccessToken()
        const refreshToken = user.createRefreshToken()
        user.refreshToken = refreshToken

        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
        
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating access and refresh tokens 😵‍💫")
    }

}

// sign up for customer
const registerUserCustomer = asyncHandler(async (req, res) => {
    
    let { username, email, password, phone_no, location } = req.body || {};

    let role = "CUSTOMER"
    
    // all fields are required
    if(!username?.trim() || !email?.trim() || !password?.trim() || !phone_no?.trim() || !location?.trim()){
        throw new ApiError(400, "All fields are required 😤")
    }

    email = email.toLowerCase();

    // email is valid or not
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid Email 📧")
    }

    // phone no. is valid or not
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(phone_no)) {
        throw new ApiError(400, "Invalid phone number 📱");
    }

    // location is valid or not

    // user exist or not
    const existingUser = await User.findOne({email})
    if(existingUser){
        throw new ApiError(409, "User Already exist 🤦")
    }

    // creating user
    const user = await User.create({
        username,
        email,
        password,
        role,
        phone_no,
        location
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        return new ApiError(400, "Something went wrong while creating user 😵‍💫")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser ,"User registered successfully 😀")
    )

})

// sign up for vendor
const registerUserVendor = asyncHandler(async (req, res) => {

    let { username, email, password, phone_no, location, business_name, delivery_end_time, delivery_start_time  } = req.body || {};
    
    // all fields are required
    if(!username?.trim() || !email?.trim() || !password?.trim() || !phone_no?.trim() || !location?.trim() || !business_name?.trim()){
        throw new ApiError(400, "All fields are required 😤")
    }

    email = email.toLowerCase();
    let role = "VENDOR"

    // email is valid or not
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid Email 📧")
    }

    // phone no. is valid or not
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(phone_no)) {
        throw new ApiError(400, "Invalid phone number 📱");
    }

    // location is valid or not

    // user exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "vendor with this email already exists");
    }
    

    // creating user
    const user = await User.create({
        username,
        email : email.toLowerCase(),
        password,
        role,
        phone_no,
        location
    })

    const vendorProfile = await Vendor.create({
        user_id: user._id, // This isreference!
        business_name,
        delivery_start_time: req.body.delivery_start_time || "09:00 AM" , // default or from req.body
        delivery_end_time: req.body.delivery_end_time || "10:00 PM" 
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        return new ApiError(400, "Something went wrong while creating vendor 😵‍💫")
    }

    return res.status(201).json(
        new ApiResponse(200, {createdUser, vendorProfile } ,"vendor registered successfully 😀")
    )

})

const loginUser = asyncHandler(async (req, res) => {

    let {email, password, role} = req.body || {}


    // all fields are required
    if(!email?.trim() || !password?.trim() || !role?.trim()){
        throw new ApiError(400, "All fields are required 😤")
    }

    role = role.toUpperCase()
    email = email.toLowerCase()

    // user exist or not
    const existingUser = await User.findOne({email})
    if(!existingUser){
        throw new ApiError(404, "User does not exist 😩")
    }
    if (existingUser.role !== role) {
        throw new ApiError(403, `This email is registered as a ${existingUser.role}. Please use the correct login portal.`);
    }

    // password correct or not
    let isPasswordValid = await existingUser.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid User Credentials 👤")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(existingUser._id)

    let loggedInUser = await User.findById(existingUser._id).select("-password -refreshToken")

    // only server can modify cookies
    const options = {
        httpOnly: true, 
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "User Logged In successfully ✌️"
        )
    )


})

// log out
const logOutUser = asyncHandler(async (req, res) => {
    // update cookies
    // delete the refresh token
    
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true   // we can get the new updated values
        }
    )

    const options = {
        httpOnly: true, 
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out 👍"))

})

export {
    registerUserCustomer,
    registerUserVendor,
    loginUser,
    logOutUser
}