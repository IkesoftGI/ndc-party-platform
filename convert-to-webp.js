// src/data/convert-to-webp.js

const imagemin = require("imagemin");
const webp = require("imagemin-webp");

(async () => {
  try {
    await imagemin(
      [
        "src/assets/ChatGPT-NPP.webp",
        "src/assets/elephant-icon.webp"
      ],
      {
        destination: "src/assets/",
        plugins: [
          webp({ quality: 80 }) // adjust 0-100 for compression
        ],
      }
    );
    console.log("✅ Conversion to WebP completed successfully!");
  } catch (err) {
    console.error("❌ Conversion failed:", err);
  }
})();
