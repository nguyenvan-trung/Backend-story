const mongoose = require("mongoose");

const ChapterSchema = new mongoose.Schema(
  {
    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      required: true,
    },
    volumeNumber: { type: Number, default: 1 },
    chapterNumber: { type: Number, required: true },
    chapterTitle: { type: String, required: true },
    content: [{ type: String, required: true }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Chapter", ChapterSchema);
