import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    subTitle: String, //by tarasingh builders
    description: String,

    //------------Project Location
    //address: String,
    locality: String, // same as adress -"Andheri East, Mumbai, Maharashtra, India"
    city: String,
    state: String,

    //------------Project Details
    projectAreaRange: {
      // below price range
      //Sq.Ft
      min: Number,
      max: Number,
    },
    projectPriceRange: {
      // shown n banner
      min: Number,
      max: Number,
    },
    priceSqFt: Number, // show on over view
    reraNumber: String,
    reraPossessionDate: { type: Date },
    availabilityStatus: String,
    amenities: [String],
    bankOfApproval: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bank",
      },
    ],
    //========Project Gallary
    images: [{}], // modify this
    isFeatured: {
      type: Boolean,
      default: false,
    },
    youtubeLink: String,
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
