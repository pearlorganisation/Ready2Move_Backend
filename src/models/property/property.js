import mongoose from "mongoose";
import { youtubeRegex } from "../../utils/regexUtils.js";

const propertySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    subTitle: { type: String, trim: true },
    description: { type: String, required: true, trim: true },
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
    apartmentName: { type: String, required: true, trim: true }, // or society name
    apartmentNo: { type: String, required: true, trim: true }, // or society no.
    locality: { type: String, required: true, trim: true }, // on card
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
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
    reraNumber: { type: String, required: true, trim: true },
    reraPossessionDate: { type: Date, required: true, trim: true },
    noOfBedrooms: { type: Number, required: true, trim: true },
    noOfBathrooms: { type: Number, required: true, trim: true },
    noOfBalconies: { type: Number, required: true, trim: true },
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
    waterSource: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feature" }],
    otherFeatures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feature" }],
    propertyFlooring: { type: mongoose.Schema.Types.ObjectId, ref: "Feature" },
    imageGallery: {
      type: [
        {
          secure_url: { type: String, required: true },
          public_id: { type: String, required: true },
        },
      ],
      required: [true, "Image gallery is required"],
      validate: {
        validator: function (images) {
          return images.length <= 8; // Maximum 8 images allowed
        },
        message: "You cannot upload more than 8 images.",
      },
    },
    isFeatured: { type: Boolean, default: false },
    youtubeEmbedLink: {
      type: String,
      required: [true, "YouTube embed link is required"],
      validate: {
        validator: function (v) {
          return youtubeRegex.test(v);
        },
        message: (props) => `${props.value} is not a valid YouTube embed link.`,
      },
    },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);

export default Property;
