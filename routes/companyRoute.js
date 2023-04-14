import express from "express";
import {
  allCompanies,
  deleteCompany,
  registerCompany,
} from "../controllers/companyController.js";
const router = express.Router();

router.route("/registerCompany").post(registerCompany).get(allCompanies);
router.route("/:id").delete(deleteCompany);

export default router;
