import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Plan } from "../models/plan.models.js";


// create plan
let createPlan = asyncHandler(async (req, res) => {

    let {name, meal_type, meal_time, duration_days, price, price_per_day, serving_size, description, general_menu, status, payment_type, cover_image} = req.body || {}

    if (!name?.trim() || !meal_type?.trim() || !meal_time?.trim() || 
        !duration_days || !price || !price_per_day || 
        !serving_size || !general_menu?.trim() || !payment_type?.trim()) {
        throw new ApiError(400, "All required fields must be provided 😤");
    }

    meal_type = meal_type.toUpperCase()
    meal_time = meal_time.toUpperCase()
    status = status ? status.toUpperCase() : "ACTIVE"
    payment_type = payment_type.toUpperCase()

    // if(meal_type!=="VEG" && meal_type!=="NON-VEG" && meal_type!=="VEGAN"){
    //     throw new ApiError(400, "Invalid meal type 🍴")
    // }

    // if(meal_time!=="BREAKFAST" && meal_time!=="LUNCH" && meal_time!=="DINNER"){
    //     throw new ApiError(400, "Invalid meal time ⏰")
    // }

    // if(status!=="ACTIVE"){
    //     throw new ApiError(400, "Only Active plans available 🙄")
    // }

    // if(payment_type!=="POSTPAID" && payment_type!=="PREPAID"){
    //     throw new ApiError(400, "Invalid payment type 💰")
    // }

    let existingPlan = await Plan.findOne({vendor_id: req.vendor._id, name})
    if(existingPlan){
        throw new ApiError(404, "Plan already exist 😩")
    }

    let plan = await Plan.create({
        vendor_id: req.vendor._id,
        name : name.trim(),
        meal_time,
        meal_type,
        duration_days,
        price,
        price_per_day,
        serving_size,
        description,
        general_menu,
        status,
        payment_type
    })

    let createdPlan = await Plan.findOne({vendor_id: req.vendor._id, name})
    if(!createdPlan){
        return new ApiError(400, "Something went wrong while creating plan 😵‍💫")
    }

    return res.status(201).json(
        new ApiResponse(200, {plan} ,"plan registered successfully 😀")
    )


})


// read plan
let getPlan = asyncHandler(async (req, res) => {

    let {name} = req.params

    if(!name.trim()){
        throw new ApiError(400, "Plan name is required to fetch details 💢");
    }

    let encodedName = name.toLowerCase().trim().replace(/\s+/g, '_')

    let plan = await Plan.findOne({vendor_id: req.vendor._id, slug: encodedName})
    if(!plan){
        throw new ApiError(404, "Plan does not exist 😩")
    }

    return res.status(200).json(
        new ApiResponse(200, plan, "Plan fetched successfully 😀")
    )

})


// delete plan
// give 5 sec to undo in frontend
let deletePlan = asyncHandler(async (req, res) => {

    const encodedName = req.params.name.toLowerCase().trim().replace(/\s+/g, '_');
    
    const plan = await Plan.findOneAndUpdate(
        { 
            vendor_id: req.vendor._id, 
            slug: encodedName 
        },
        { 
            $set: { 
                status: "DELETED",
                deletedAt: new Date() // Record the time of "soft" deletion
            } 
        },
        { new: true }
    );

    if (!plan) throw new ApiError(404, "Plan not found");
    
    return res.status(200).json(new ApiResponse(200, {}, "Plan deleted successfully!"));
});


// pause the plan
let pausePlan = asyncHandler(async (req, res) => {

    const { name } = req.params;

    const slug = name.toLowerCase().trim().replace(/\s+/g, '_');

    const pausedPlan = await Plan.findOneAndUpdate(
        { 
            vendor_id: req.vendor._id, 
            slug: slug 
        },
        { 
            $set: { status: "PAUSED" } 
        },
        { 
            new: true 
        }
    );

    if (!pausedPlan) {
        throw new ApiError(404, "Plan not found 😩");
    }

    return res.status(200).json(
        new ApiResponse(200, pausedPlan, "Plan paused successfully! 🚀")
    );

})


// resume the plan
let resumePlan = asyncHandler(async (req, res) => {

    const { name } = req.params;

    const slug = name.toLowerCase().trim().replace(/\s+/g, '_');

    const resumedPlan = await Plan.findOneAndUpdate(
        { 
            vendor_id: req.vendor._id, 
            slug: slug 
        },
        { 
            $set: { status: "ACTIVE" } 
        },
        { 
            new: true 
        }
    );

    if (!resumedPlan) {
        throw new ApiError(404, "Plan not found 😩");
    }

    return res.status(200).json(
        new ApiResponse(200, resumedPlan, "Plan resumed successfully! 🚀")
    );
});


export {
    createPlan,
    getPlan,
    deletePlan,
    pausePlan,
    resumePlan
}