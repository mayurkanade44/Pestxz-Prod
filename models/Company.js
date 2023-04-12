import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    companyAddress: { type: String, required: true },
    companyContact: { type: Number, required: true },
    companyEmail: { type: String, required: true },
    companyDetails: { CIN: String, License: String, GST: String },
  },
  { timestamps: true }
);

export default mongoose.model("Company", CompanySchema);
