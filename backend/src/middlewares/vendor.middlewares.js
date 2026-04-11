import { Vendor } from "../models/vendor.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

let verifyVendor = asyncHandler(async (req, _, next) => {

    try {

        let vendor = await Vendor.findOne({user_id: req.user._id})

        if(!vendor){
            throw new ApiError(403, "Access denied. 🙅 You are not a registered vendor.")
        }

        req.vendor = vendor
        next()
        
    } catch (error) {
        console.log("Error in veify Vendor 😣 :: ", error);
    }

})

export {verifyVendor} 