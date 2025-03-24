import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  bgImage: {
    secure_url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  headline: { type: String, required: true, trim: true },
  quote: { type: String, required: true, trim: true },
});

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;
