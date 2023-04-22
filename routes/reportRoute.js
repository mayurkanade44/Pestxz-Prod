import express from "express";
import { getLocationServices } from "../controllers/locationController.js";
import {
  addRecord,
  generateServiceReport,
} from "../controllers/reportController.js";
import { authorizeUser } from "../middleware/auth.js";
const router = express.Router();

router
  .route("/addRecord/:id")
  .post(authorizeUser("Admin", "Operator"), addRecord);
router.route("/allReports").get(authorizeUser("Admin"), generateServiceReport);
router
  .route("/locationServices/:id")
  .get(authorizeUser("Admin", "Operator"), getLocationServices);

export default router;
