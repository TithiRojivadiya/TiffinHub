import { Router } from "express";
import {loginUser, logOutUser, registerUserCustomer, registerUserVendor} from "../controllers/user.controllers.js"
import multer from 'multer'
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()
const upload = multer();

router.post("/register/customer", upload.none(), registerUserCustomer); // http://localhost:8000/api/v1/users/register/customer
router.post("/register/vendor", upload.none(), registerUserVendor); // http://localhost:8000/api/v1/users/register/vendor
router.route("/login").post(upload.none(), loginUser)  // http://localhost:8000/api/v1/users/login


// secured routes
router.route("/logout").post(verifyJWT, logOutUser) // http://localhost:8000/api/v1/users/logout

export default router