import express from "express";
import {
  addService,
  deleteService,
  editService,
  getCompanyServices,
} from "../controllers/adminController.js";
import { authorizeUser } from "../middleware/auth.js";

const router = express.Router();

router.route("/service").post(addService).get(getCompanyServices);
router.route("/service/:id").patch(editService).delete(deleteService);

export default router;
