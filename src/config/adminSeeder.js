const bcrypt = require("bcryptjs");
const User = require("../models/User");

const seedAdminAccounts = async () => {
  try {
    const adminCount = await User.countDocuments({ role: "admin" });

    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      const defaultAdmins = [
        { username: "admin_chinh", password: hashedPassword, role: "admin" },
        { username: "admin_phu", password: hashedPassword, role: "admin" },
      ];

      await User.insertMany(defaultAdmins);
      console.log("✅ Khởi tạo thành công 2 tài khoản Admin mặc định.");
    } else {
      console.log("ℹ️ Hệ thống đã có tài khoản Admin, bỏ qua bước khởi tạo.");
    }
  } catch (error) {
    console.error("❌ Lỗi khởi tạo Admin:", error);
  }
};

module.exports = { seedAdminAccounts };
