const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      message: "Từ chối truy cập! Hệ thống không tìm thấy mã Token bảo mật.",
    });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || "trung_secret_key_bảo_mật_123";
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Lỗi quyền truy cập! Bạn không có quyền quản trị viên.",
      });
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Mã Token không hợp lệ hoặc đã hết hạn!" });
  }
};

module.exports = verifyAdmin;
