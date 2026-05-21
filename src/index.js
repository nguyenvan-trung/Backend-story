const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

console.log("=== SERVER STARTING ON RENDER ===");
console.log("MONGO_URI loaded:", !!process.env.MONGO_URI);

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Test route
app.get("/", (req, res) => {
  res.send("✅ Backend Story is running successfully on Render!");
});

// Import routes sau (để tránh crash ngay từ đầu)
let apiRoutes;
try {
  apiRoutes = require("./router/storyRouter");
  app.use("/api", apiRoutes);
  console.log("✅ Router loaded successfully");
} catch (err) {
  console.error("⚠️ Router load failed:", err.message);
}

// MongoDB Connection
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://trung:trung123@cluster0.op73u4r.mongodb.net/storyhub_db?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("✅ Kết nối thành công tới Database MongoDB");

    // Chỉ chạy seeder nếu có
    try {
      const { seedAdminAccounts } = require("./config/adminSeeder");
      await seedAdminAccounts();
    } catch (err) {
      console.log("⚠️ Seeder skipped or not found:", err.message);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running at port ${PORT}`);
      console.log(`🌐 URL: https://backend-story.onrender.com`);
    });
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối database:", err.message);
  });

// Graceful shutdown
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
