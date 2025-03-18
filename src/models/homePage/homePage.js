import mongoose from "mongoose";

const homepageSchema = new mongoose.Schema({
  backgroundImage: { type: String, required: true },
  headline: { type: String, required: true },
  quote: { type: String, required: true },
});

const Homepage = mongoose.model("Homepage", homepageSchema);

export default Homepage;
