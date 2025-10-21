import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase().trim();

    // ✅ If extension is missing or invalid, force .jpg
    if (!ext || ![".jpg", ".jpeg", ".png"].includes(ext)) {
      ext = ".jpg";
    }

    cb(null, `${Date.now()}${ext}`);
  },
});

// ✅ IMPORTANT: no fileFilter here
const upload = multer({ storage });

export default upload;
