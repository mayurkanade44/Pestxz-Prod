import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    reportData: [Object],
    location: {
      type: mongoose.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    shipTo: {
      type: mongoose.Types.ObjectId,
      ref: "ShipTo",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Report", ReportSchema);
