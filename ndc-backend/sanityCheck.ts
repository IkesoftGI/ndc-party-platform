// ✅ sanityCheck.ts (NDC version)
import mongoose from "mongoose";
import { User } from "./src/models/User";

async function checkExecutives() {
  try {
    // ✅ Connect to your NDC MongoDB Atlas database
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ndc-platform");

    console.log("✅ Connected to NDC database... Checking executives...");

    const executives = await User.find({
      "role.unit": { $in: ["Constituency Executives", "Polling Station Executives"] },
    }).lean();

    console.log("🔎 Total Executives Found:", executives.length);
    executives.forEach((u) => {
      console.log(
        `${u.name} | ${u.role?.unit} | ${u.role?.position} | ${u.region} - ${u.constituency} | Active: ${u.role?.isActive}`
      );
    });
  } catch (err) {
    console.error("❌ Error during check:", err);
  } finally {
    await mongoose.disconnect();
    console.log("✅ Disconnected from NDC database");
  }
}

checkExecutives();
