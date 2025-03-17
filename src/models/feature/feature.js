import mongoose from "mongoose";
import { featureTypes } from "../../../constants.js";

const featureSchema = new mongoose.Schema(
  {
    name: { type: String },
    type: { type: String, enum: featureTypes }, // Property type, Parking
  },
  { timestamps: true }
);

const Feature = mongoose.model("Feature", featureSchema);

export default Feature;
