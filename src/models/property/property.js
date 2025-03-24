import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    subTitle: { type: String },
    description: { type: String, required: true },
    service: { type: String, enum: ["SELL", "RENT"], required: true }, // search for property
    property: {
      // search for property
      type: String,
      enum: ["RESIDENTIAL", "COMMERCIAL"],
      required: true,
    },
    propertyType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feature",
      required: true,
    }, // search for property
    apartmentName: { type: String, required: true }, // or society name
    apartmentNo: { type: String, required: true }, // or society no.
    locality: { type: String, required: true }, // on card
    city: { type: String, required: true },
    state: { type: String, required: true },
    area: [
      {
        name: {
          type: String,
          enum: ["CARPET_AREA", "BUILT_UP_AREA", "SUPER_AREA"],
          required: true,
        },
        area: { type: Number, required: true },
        areaMeasurement: {
          type: String,
          enum: ["SQ_FT", "SQ_M"],
          default: "SQ_FT",
        },
      },
    ],
    reraNumber: { type: String, required: true },
    possession: { type: Date, required: true },
    noOfBedrooms: { type: Number, required: true },
    noOfBathrooms: { type: Number, required: true },
    noOfBalconies: { type: Number, required: true },
    parking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feature",
      required: true,
    }, // Stilt parking,
    furnishing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feature",
      required: true,
    },
    entranceFacing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feature",
      required: true,
    }, //Orientation from pdf
    availability: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feature",
      required: true,
    }, // available from -> pdf
    propertyAge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feature",
      required: true,
    },
    isOCAvailable: { type: Boolean, default: false },
    isCCAvailable: { type: Boolean, default: false },
    ownership: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feature",
      required: true,
    },
    expectedPrice: { type: Number, required: true }, // price in bannner
    isPriceNegotiable: { type: Boolean, default: false },
    isBrokerageCharge: { type: Boolean, default: false },
    brokerage: { type: Number, default: 0 },
    bankOfApproval: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feature" }],
    aminities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feature" }],
    waterSource: { type: mongoose.Schema.Types.ObjectId, ref: "Feature" },
    otherFeatures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feature" }],
    propertyFlooring: { type: mongoose.Schema.Types.ObjectId, ref: "Feature" },
    imageGallary: [{ secure_url: String, public_id: String }],
    isFeatured: { type: Boolean, default: false },
    youtubeEmbedLink: { type: String },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);

export default Property;
