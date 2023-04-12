import express from "express";
import {
  addShipTo,
  deleteShipTo,
  updateShipTo,
} from "../controllers/shipToController.js";
const router = express.Router();

router.route("/client").post(addShipTo);
router.route("/client/:id").patch(updateShipTo).delete(deleteShipTo);

export default router;
