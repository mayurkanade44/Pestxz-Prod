import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    serviceName: { type: String },
    serviceOption: [String],
    productName: { type: String },
    company: {
      type: mongoose.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Admin", AdminSchema);
