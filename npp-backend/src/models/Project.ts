// npp-backend/src/models/Project.ts
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String }, // e.g., Infrastructure, Education, Health
    status: { type: String, enum: ["ongoing", "completed", "delayed"], default: "ongoing" },
    region: { type: String },
    constituency: { type: String },
    photo: { type: String }, // optional project image
    createdBy: { type: String }, // optional: admin or user ID
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
