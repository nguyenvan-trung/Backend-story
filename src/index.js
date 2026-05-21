const path = require("path");
// Sửa lỗi tìm file .env khi chạy bằng lệnh `node src/index.js`
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const apiRoutes = require("./router/storyRouter");
const { seedAdminAccounts } = require("./config/adminSeeder");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Tiền tố hệ thống API mẫu
app.use("/api", apiRoutes);

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://trung:trung123@cluster0.op73u4r.mongodb.net/storyhub_db?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("=== Kết nối thành công tới Database MongoDB ===");

    // Tự động gieo tài khoản Admin mặc định
    await seedAdminAccounts();

    app.listen(PORT, () => {
      console.log(
        `=== Backend Server đang chạy tại: http://localhost:${PORT} ===`,
      );
    });
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối database: ", err);
  });
