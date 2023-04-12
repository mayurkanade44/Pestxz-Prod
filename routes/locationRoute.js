import express from "express";
import {
  addLocation,
  deleteLocation,
  editLocation,
  getLocationServices,
  getSingleShipTo,
} from "../controllers/locationController.js";
const router = express.Router();

router.route("/addLocation/:id").post(addLocation);
router
  .route("/locationServices/:id")
  .patch(editLocation)
  .delete(deleteLocation);
router.route("/singleShipTo/:id").get(getSingleShipTo);

export default router;
