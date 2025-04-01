import mongoose from "mongoose";

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
    service: { type: String, enum: ["SELL", "RENT"], required: true }, // search for project
    projectType: {
      // search for property
      type: String,
      enum: ["RESIDENTIAL", "COMMERCIAL"],
      required: true,
    },
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
    imageGallery: {
      type: [
        {
          secure_url: { type: String, required: true },
          public_id: { type: String, required: true },
        },
      ],
      validate: {
        validator: function (images) {
          return images.length <= 8; // Maximum 8 images allowed
        },
        message: "You cannot upload more than 8 images.",
      },
    },
    isFeatured: { type: Boolean, default: false },
    youtubeEmbedLink: { type: String },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
