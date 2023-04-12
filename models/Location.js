import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
  {
    floor: { type: String, required: true },
    location: { type: String, required: true },
    qr: { type: String },
    services: [
      {
        service: {
          type: mongoose.Types.ObjectId,
          ref: "Admin",
          required: true,
        },
        count: { type: String },
      },
    ],
    shipTo: {
      type: mongoose.Types.ObjectId,
      ref: "ShipTo",
      required: true,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

LocationSchema.virtual("reports", {
  ref: "Report",
  localField: "_id",
  foreignField: "location",
  justOne: false,
});

export default mongoose.model("Location", LocationSchema);
