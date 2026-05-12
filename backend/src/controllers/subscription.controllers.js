import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Plan } from "../models/plan.models.js";
import { asyncHandler } from "../utils/asyncHandler";
import { Subscription } from "../models/subscription.models.js";

const verifyOwnership = (resource, userId) => {
    if (resource.user_id.toString() !== userId.toString()) {
        throw new ApiError(403, "Access denied: You do not own this resource. 😒");
    }
};

function isPlanDateValid(startDate, endDate) {
    // 1. Convert to date objects to ensure consistency
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    // 2. Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return false; 
    }

    // 3. Set times to midnight to compare just the calendar dates
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // 4. Validation logic:
    // - End date must not be in the past (must be >= today)
    // - End date must be after or on the same day as start date
    const isFutureOrToday = end >= today;
    const isAfterStart = end >= start;

    return isFutureOrToday && isAfterStart;
}

// to subscribe Plan     ---> /users/:planId/subscribe   
let subscribePlan = asyncHandler(async (req, res) => {

    let { planId } = req.params || {};
    if (!planId) {
        throw new ApiError(400, "planId required 😤");
    }

    let planExist = await Plan.findById(planId);
    if (!planExist) {
        throw new ApiError(404, "Plan does not exist 😩");
    }

    // 1. Check if a subscription entry already exists for this user and plan
    let existingSubscription = await Subscription.findOne({
        user_id: req.user._id,
        plan: planId
    });

    // 2. Logic for existing record
    if (existingSubscription) {
        // If it's already ACTIVE, don't let them subscribe again
        if (existingSubscription.status === "ACTIVE") {
            throw new ApiError(405, "Plan already subscribed 🙄");
        }

        // RE-ACTIVATE existing record (Cancelled, Expired, etc.)
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + planExist.duration_days);

        existingSubscription.status = "ACTIVE";
        existingSubscription.start_date = startDate;
        existingSubscription.end_date = endDate;
        existingSubscription.days_consumed = 0;
        existingSubscription.value_consumed = 0;
        existingSubscription.extra_days_added = 0;
        existingSubscription.total_amount = planExist.price;
        existingSubscription.amount_paid = 0;
        existingSubscription.outstanding_amount = planExist.price;
        existingSubscription.payment_status = "PENDING";
        existingSubscription.pause_periods = [];
        existingSubscription.cancelled_at = undefined; // Clear the cancellation timestamp

        await existingSubscription.save();

        return res.status(200).json(
            new ApiResponse(200, existingSubscription, "Subscription re-activated successfully 😀")
        );
    }

    // 3. Logic for NEW record (if no entry exists at all)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + planExist.duration_days);

    let newPlan = await Subscription.create({
        user_id: req.user._id, // Use the ID specifically
        plan: planId, // Just pass the ID
        start_date: startDate,
        end_date: endDate,
        days_consumed: 0,
        value_consumed: 0,
        extra_days_added: 0,
        total_amount: planExist.price,
        amount_paid: 0,
        outstanding_amount: planExist.price,
        payment_status: "PENDING",
        status: "ACTIVE",
        pause_periods: []
    });

    if (!newPlan) {
        throw new ApiError(400, "Something went wrong while subscribing plan 😵‍💫");
    }

    return res.status(201).json(
        new ApiResponse(201, newPlan, "Plan subscribed successfully 😀")
    )
    
});


// to unsubscribe Plan  ---> /users/:planId/unsubscribe
let unsubscribePlan = asyncHandler(async (req, res) => {

    const { subscriptionId } = req.params || {};
    if(!subscriptionId){
        throw new ApiError(400, "planId required 😤");
    }

    const sub = await Subscription.findOne({ 
        _id: subscriptionId, 
        user_id: req.user._id, 
        status: "ACTIVE" 
    });

    if (!sub) {
        throw new ApiError(404, "No active subscription found to cancel 😶");
    }

    verifyOwnership(sub, req.user._id)

    sub.status = "CANCELLED";
    sub.cancelled_at = Date.now(); 
    
    await sub.save();

    return res.status(200).json(
        new ApiResponse(200, sub, "Subscription cancelled successfully 👋")
    );

})


// to pay the amount of subscription    ---> /users/:planId/payment
let makePayment = asyncHandler(async (req, res) => {

    let {planId} = req.params || {}
    if(!planId){
        throw new ApiError(400, "planId required 😤");
    }

    let planExist = await Subscription.findById(planId)
    if(!planExist){
        throw new ApiError(404, "Plan does not exist 😩")
    }

    if (planExist.payment_status === "PAID") {
        return res.status(200).json(new ApiResponse(200, "Plan is already paid"));
    }

    verifyOwnership(planExist, req.user._id)

    planExist.payment_status = "PAID"

    await planExist.save()

    return res.status(200).json(
        new ApiResponse(200, "Payment successfully 👋")
    );

})


// to pause Subscription    ---> /users/:planId/pause
let pauseSubscription = asyncHandler(async (req, res) => {
    let { planId } = req.params || {};
    if (!planId) throw new ApiError(400, "Subscription ID required 😤");

    let { pause_start_date, pause_end_date } = req.body || {};
    if (!pause_start_date || !pause_end_date) {
        throw new ApiError(400, "Both start and end dates are required 😤");
    }

    let subscription = await Subscription.findById(planId);
    if (!subscription) throw new ApiError(404, "Subscription not found 😩");

    verifyOwnership(subscription, req.user._id);

    const start = new Date(pause_start_date);
    const end = new Date(pause_end_date);

    // 1. Basic Date Validation (End after Start, etc.)
    if (!isPlanDateValid(pause_start_date, pause_end_date)) {
        throw new ApiError(405, "Dates are not valid 📅");
    }

    // 2. OVERLAP CHECK: Ensure the new pause doesn't hit an old one
    const isOverlapping = subscription.pause_periods.some(period => {
        const existingStart = new Date(period.from);
        const existingEnd = new Date(period.to);

        // Logic: (StartA <= EndB) and (EndA >= StartB)
        return start <= existingEnd && end >= existingStart;
    });

    if (isOverlapping) {
        throw new ApiError(409, "This period overlaps with an existing pause. 🛑");
    }

    // 3. BOUNDARY CHECK: Ensure the pause is within the plan's duration
    if (start > subscription.end_date) {
        throw new ApiError(400, "Cannot pause a plan after its current expiry date. 📉");
    }

    // --- LOGIC CONTINUES ---
    const timeDiff = end.getTime() - start.getTime();
    const pauseDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    subscription.pause_periods.push({ from: start, to: end });
    subscription.extra_days_added += pauseDays;
    
    const newEndDate = new Date(subscription.end_date);
    newEndDate.setDate(newEndDate.getDate() + pauseDays);
    subscription.end_date = newEndDate;

    // Immediate status update if pause starts today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start <= today && end >= today) {
        subscription.status = "PAUSED";
    }

    await subscription.save();

    return res.status(200).json(
        new ApiResponse(200, subscription, `Subscription paused for ${pauseDays} days.`)
    );
});


// to resume Subscription ---> /users/:planId/resume
let resumeSubscription = asyncHandler(async (req, res) => {
    let { planId } = req.params || {};

    let subscription = await Subscription.findById(planId);
    if (!subscription) throw new ApiError(404, "Subscription not found");

    verifyOwnership(subscription, req.user._id);

    if (subscription.status !== "PAUSED") {
        throw new ApiError(400, "Subscription is not in a paused state.");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find the latest pause period
    const lastPause = subscription.pause_periods[subscription.pause_periods.length - 1];

    if (lastPause && lastPause.to > today) {
        // They are resuming EARLY
        const unusedTime = lastPause.to.getTime() - today.getTime();
        const unusedDays = Math.ceil(unusedTime / (1000 * 3600 * 24));

        // Pull the end date back since they didn't use the full pause
        subscription.end_date = new Date(subscription.end_date.getTime() - unusedTime);
        subscription.extra_days_added -= unusedDays;
        
        // Update the log so we know they resumed early
        lastPause.to = today;
    }

    subscription.status = "ACTIVE";
    await subscription.save();

    return res.status(200).json(new ApiResponse(200, subscription, "Resumed manually! 🍱"));
});


// to get Subscribed Plan ---> /users/:planId
let getSubscribedPlan = asyncHandler(async (req, res) => {

    let {planId} = req.params || {}
    if(!planId){
        throw new ApiError(400, "planId required 😤");
    }

    let planExist = await Subscription.findById(planId)
    if(!planExist){
        throw new ApiError(404, "Plan does not exist 😩")
    }

    verifyOwnership(planExist, req.user._id)

    if(planExist.status !== "ACTIVE"){
        throw new ApiError(400, "This subscription is not currently active 🙁");
    }

    return res.status(200).json(
        new ApiResponse(200, planExist, "Plan fetched successfully 👋")
    );

})


// to get all Subscribed Plan ---> /users/getSubscribedPlans
let getAllSubscribedPlan = asyncHandler(async (req, res) => {

    const allPlans = await Subscription.find({ 
        user_id: req.user._id,
        status: "ACTIVE" 
    });

    return res.status(200).json(
        new ApiResponse(200, allPlans, "All active plans fetched successfully 👍🏻")
    );

})


export {
    subscribePlan,
    unsubscribePlan,
    makePayment,
    pauseSubscription,
    resumeSubscription,
    getSubscribedPlan,
    getAllSubscribedPlan
}
