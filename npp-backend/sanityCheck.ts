// sanityCheck.ts
import mongoose from "mongoose";
import { User } from "./src/models/User";

async function checkExecutives() {
  await mongoose.connect("mongodb://localhost:27017/npp-platform");

  const executives = await User.find({
    "role.unit": { $in: ["Constituency Executives", "Polling Station Executives"] },
  }).lean();

  console.log("Total Executives Found:", executives.length);
  executives.forEach((u) => {
    console.log(
      `${u.name} | ${u.role?.unit} | ${u.role?.position} | ${u.region} - ${u.constituency} | Active: ${u.role?.isActive}`
    );
  });

  await mongoose.disconnect();
}

checkExecutives().catch(console.error);
