import cron from "node-cron";
import { Subscription } from "../models/subscription.models.js";

// This runs every day at 00:00 (Midnight)
export const initCronJobs = () => {
    cron.schedule("0 0 * * *", async () => {
        console.log("Running Daily Subscription Status Check... 🕒");

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find all subscriptions that are PAUSED and should have resumed by today
        const expiredPauses = await Subscription.updateMany(
            {
                status: "PAUSED",
                pause_periods: {
                    $elemMatch: {
                        to: { $lt: today } // The 'to' date is in the past
                    }
                }
            },
            {
                $set: { status: "ACTIVE" }
            }
        );

        console.log(`Automatically resumed ${expiredPauses.modifiedCount} subscriptions.`);
    });
};