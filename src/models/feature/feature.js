import mongoose from "mongoose";
import { featureTypes } from "../../../constants.js";

const featureSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum: featureTypes },
  },
  { timestamps: true }
);

const Feature = mongoose.model("Feature", featureSchema);

export default Feature;
