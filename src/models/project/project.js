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
    subTitle: { type: String }, //by tarasingh builders
    description: { type: String },

    //======Project Location============
    locality: String, // same as adress -"Andheri East, Mumbai, Maharashtra, India"
    city: String,
    state: String,

    //=========roject Details==========
    areaRange: {
      // below price range
      //Sq.Ft
      min: Number,
      max: Number,
    },
    priceRange: {
      // shown n banner
      min: Number,
      max: Number,
    },
    pricePerSqFt: Number, // show on over view
    reraNumber: { type: String },
    availability: {
      // Readyto move, underconstruction
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feature",
    },
    reraPossessionDate: { type: Date },
    aminities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feature" }],
    bankOfApproval: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bank",
      },
    ],

    //========Project Gallary======
    imageGallary: [{ secure_url: String, public_id: String }], // modify this
    isFeatured: {
      type: Boolean,
      default: false,
    },
    youtubeLink: { type: String },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
