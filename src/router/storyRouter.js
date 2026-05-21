const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const storyController = require("../controllers/storyController");
const verifyAdmin = require("../middlewares/auth");

// Cổng xác thực tài khoản
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

// Cổng đọc truyện công khai (Không Token)
router.get("/stories", storyController.getAllStories);
router.get("/stories/:id", storyController.getStoryById);
router.get("/chapters/:chapterId", storyController.getChapterDetailById);

// Cổng quản trị tác vụ (Bắt buộc Token Admin)
router.post("/admin/stories", verifyAdmin, storyController.createStory);
router.post("/admin/chapters", verifyAdmin, storyController.createChapter);

module.exports = router;
