import mongoose from "mongoose";
import { youtubeRegex } from "../../utils/regexUtils.js";

const projectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    subTitle: { type: String },
    description: { type: String, required: true },
    locality: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    areaRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    }, //Sq.Ft
    priceRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    pricePerSqFt: { type: Number, required: true }, //Price Per Sq.Ft
    reraNumber: { type: String, required: true },
    availability: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feature",
      required: true,
    },
    reraPossessionDate: { type: Date, required: true },
    aminities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feature" }],
    bankOfApproval: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feature" }],
    imageGallary: [{ secure_url: String, public_id: String }],
    isFeatured: { type: Boolean, default: false },
    youtubeLink: {
      type: String,
      validate: {
        validator: function (v) {
          return youtubeRegex.test(v);
        },
        message: (props) => `${props.value} is not a valid YouTube URL!`,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
