const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    cover: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&q=80",
    },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Đang ra", "Full", "Tạm ngưng"],
      default: "Đang ra",
    },
    latestChapter: { type: String, default: "Chưa có chương" },
    viewCount: { type: Number, default: 0 },
    categories: [{ type: String }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Story", StorySchema);
