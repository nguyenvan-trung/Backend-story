const Story = require("../models/Story");
const Chapter = require("../models/Chapter");

// Lấy danh sách truyện (Công khai)
const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.status(200).json(stories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách truyện", error: error.message });
  }
};

// Chi tiết truyện + Gom chương + Tự động tăng lượt xem (Công khai)
const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm và tự động tăng viewCount lên 1 đơn vị khi có người click xem truyện
    const story = await Story.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true },
    );

    if (!story) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bộ truyện yêu cầu!" });
    }

    const chapters = await Chapter.find({ storyId: id }).sort({
      chapterNumber: 1,
    });

    res.status(200).json({
      ...story._doc,
      chapters: chapters,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi hệ thống khi tải chi tiết truyện",
      error: error.message,
    });
  }
};

// Đọc nội dung chương truyện chi tiết (Công khai)
const getChapterDetailById = async (req, res) => {
  try {
    const { chapterId } = req.params;
    // Tìm hàm này ở backend và sửa dòng tìm kiếm thành:
    const chapter = await Chapter.findById(chapterId).populate("storyId");

    if (!chapter) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy chương truyện yêu cầu!" });
    }

    res.status(200).json(chapter);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tải nội dung chương truyện",
      error: error.message,
    });
  }
};

// Tạo truyện mới (Admin)
const createStory = async (req, res) => {
  try {
    const newStory = new Story(req.body);
    const savedStory = await newStory.save();
    res.status(201).json(savedStory);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Lỗi khi tạo truyện mới", error: error.message });
  }
};

// Tạo chương mới + Kiểm tra hợp lệ + Cập nhật chương mới nhất (Admin)
const createChapter = async (req, res) => {
  try {
    const { storyId, chapterNumber, chapterTitle } = req.body;

    const targetStory = await Story.findById(storyId);
    if (!targetStory) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy truyện hợp lệ để thêm chương!" });
    }

    const newChapter = new Chapter(req.body);
    const savedChapter = await newChapter.save();

    // Cập nhật text chương mới nhất ra ngoài danh sách trang chủ
    targetStory.latestChapter = `Chương ${chapterNumber}: ${chapterTitle}`;
    await targetStory.save();

    res.status(201).json(savedChapter);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Lỗi khi tạo chương mới", error: error.message });
  }
};

module.exports = {
  getAllStories,
  getStoryById,
  createStory,
  createChapter,
  getChapterDetailById,
};
