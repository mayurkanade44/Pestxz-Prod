import mongoose from "mongoose";


const ShipToSchema = new mongoose.Schema(
  {
    shipToName: { type: String, required: true },
    shipToAddress: { type: String, required: true },
    shipToEmail: { type: String },
    shipToNumber: { type: Number },
    company: {
      type: mongoose.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true }
);



export default mongoose.model("ShipTo", ShipToSchema);
