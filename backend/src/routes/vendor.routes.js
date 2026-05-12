import { Router } from "express";
import multer from "multer";
import {verifyJWT} from "../middlewares/auth.middlewares.js" 
import {verifyVendor} from "../middlewares/vendor.middlewares.js"
import { createPlan, getPlan, deletePlan, resumePlan,  pausePlan} from "../controllers/plan.controllers.js";

const vendorRouter = Router()
const upload = multer()

vendorRouter.route("/plans").post(
    upload.fields(
        [
            {
                name: 'coverImage',
                maxCount: 1
            }
        ]
    )
)

vendorRouter.post("/plans", verifyJWT, verifyVendor, createPlan )   // create   // http://localhost:8000/api/v1/vendors/plans
vendorRouter.get("/plans/:name", verifyJWT, verifyVendor,  getPlan)   // get plan   // http://localhost:8000/api/v1/vendors/plans/Student Special Lunch
vendorRouter.delete("/plans/:name", verifyJWT, verifyVendor,  deletePlan)   // delete plan  // 
vendorRouter.patch("/plans/:name/pause", verifyJWT, verifyVendor,  pausePlan)   // pause plan   // http://localhost:8000/api/v1/vendors/plans/Student Special Lunch/pause
vendorRouter.patch("/plans/:name/resume", verifyJWT, verifyVendor,  resumePlan)   // resume plan    // http://localhost:8000/api/v1/vendors/plans/Student Special Lunch/resume


export default vendorRouter
