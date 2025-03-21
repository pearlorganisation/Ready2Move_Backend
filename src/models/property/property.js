import mongoose from "mongoose";
import { youtubeRegex } from "../../utils/regexUtils.js";

const PropertySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    subTitle: { type: String },
    description: { type: String },
    service: { type: String, enum: ["SELL", "RENT"], required: true },
    property: {
      type: String,
      enum: ["RESIDENTIAL", "COMMERCIAL"],
      required: true,
    },
    propertyType: { type: mongoose.Schema.Types.ObjectId, ref: "Feature" },
    apartmentName: { type: String }, // or society name
    apartmentNo: { type: String }, // or society no.
    locality: { type: String, required: true }, // on card
    city: { type: String },
    state: { type: String },
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
    reraNumber: { type: String },
    possession: { type: Date },
    noOfBedrooms: { type: Number, required: true },
    noOfBathrooms: { type: Number, required: true },
    noOfBalconies: { type: Number, required: true },
    parking: { type: mongoose.Schema.Types.ObjectId, ref: "Feature" }, // Stilt parking,
    furnishing: { type: mongoose.Schema.Types.ObjectId, ref: "Feature" },
    entranceFacing: { type: mongoose.Schema.Types.ObjectId, ref: "Feature" }, //Orientation from pdf
    availability: { type: mongoose.Schema.Types.ObjectId, ref: "Feature" }, // available from -> pdf
    propertyAge: { type: mongoose.Schema.Types.ObjectId, ref: "Feature" },
    isOCAvailable: { type: Boolean, default: false },
    isCCAvailable: { type: Boolean, default: false },
    ownership: { type: mongoose.Schema.Types.ObjectId, ref: "Feature" },
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
  { timestamps: true }
);

module.exports = mongoose.model("Property", PropertySchema);
