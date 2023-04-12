import express from "express";
import { registerCompany } from "../controllers/companyController.js";
const router = express.Router();

router.route("/registerCompany").post(registerCompany);

export default router;
