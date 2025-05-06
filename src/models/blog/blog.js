import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    thumbImage: {
      public_id: { type: String, required: true },
      secure_url: { type: String, required: true },
    },
    content: { type: String, required: true, trim: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "publishedAt", updatedAt: "updatedAt" },
  }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
