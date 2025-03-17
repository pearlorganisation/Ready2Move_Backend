import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    subTitle: { type: String },
    description: { type: String },
    service: { type: String, enum: ["SELL", "RENT"], required: true },
    propertyType: {
      type: String,
      enum: ["RESIDENTIAL", "COMMERCIAL"],
      required: true,
    },
    // Property locaiotn
    apartmentName: { type: String }, // or society name
    apartmentNo: { type: String }, // or society no.
    locality: { type: String, required: true }, // on card
    state: String,
    city: String,
    //================ Property Details
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
    rera: { type: String },
    possession: { type: Date },
    noOfBedrooms: { type: Number, required: true },
    noOfBathrooms: { type: Number, required: true },
    noOfBalconies: { type: Number, required: true },
    propertyParking: { type: mongoose.Schema.Types.ObjectId, ref: "Parking" }, // Stilt parking,
    propertyFurnishing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Furnishing",
    },
    propertyEntranceFacing: {
      //Orientation
      type: mongoose.Schema.Types.ObjectId,
      ref: "EntranceFacing",
    },
    propertyAvailability: {
      // Readyto move, underconstruction
      type: mongoose.Schema.Types.ObjectId,
      ref: "Availability",
    },
    propertyAge: { type: mongoose.Schema.Types.ObjectId, ref: "PropertyAge" },
    //     totalFloors: { type: Number, required: true },
    //     propertyOnFloor: { type: Number, required: true },

    ocAvailable: { type: Boolean, default: false },
    ccAvailable: { type: Boolean, default: false },
    // =============price details
    propertyOwnership: {
      // Free Hold
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ownership",
    },
    expectedPrice: { type: Number, required: true }, // price in bannner
    priceNegotiable: { type: Boolean, default: false },
    brokerageCharge: { type: Boolean, default: false },
    //     brokerageType: { type: String, enum: ["FIXED", "PERCENTAGE"] },
    //     brokerage: { type: Number, default: 0 },
    //     brokerageNegotiable: { type: Boolean, default: false },

    // ========Amenities details
    bankOfApproval: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bank",
      },
    ],
    aminities: [String],
    waterSource: { type: mongoose.Schema.Types.ObjectId, ref: "WaterSource" },
    otherFeatures: {
      // Prime Location ,Good connectivity
      type: mongoose.Schema.Types.ObjectId,
      ref: "OtherFeatures",
    },
    propertyFlooring: {
      // Ceramic , Vetrified
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flooring",
    },
    //===image and yt link
    youtubeLink: { type: String },
    imageGallary: [{}],
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", PropertySchema);
