import mongoose from "mongoose";
import { youtubeRegex } from "../../utils/regexUtils.js";

const projectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    subTitle: { type: String },
    description: { type: String },
    locality: { type: String },
    city: { type: String },
    state: { type: String },
    areaRange: { min: Number, max: Number }, //Sq.Ft
    priceRange: { min: Number, max: Number },
    pricePerSqFt: Number, //Price Per Sq.Ft
    reraNumber: { type: String },
    availability: { type: mongoose.Schema.Types.ObjectId, ref: "Feature" },
    reraPossessionDate: { type: Date },
    aminities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feature" }],
    bankOfApproval: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bank" }],
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
