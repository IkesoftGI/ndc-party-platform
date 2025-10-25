// ndc-backend\src\models\User.ts

import mongoose from "mongoose";

// ✅ Define Role Schema separately
const roleSchema = new mongoose.Schema(
  {
    scope: {
      type: String,
      enum: ["National", "Regional", "Constituency"],
    },
    unit: {
      type: String,
      enum: [
        "National Executives",
        "National Council of Elders",
        "Regional Executives",
        "Regional Council of Elders",
        "Constituency Executives",
        "Constituency Council of Elders",
        "Electoral Area Coordinators",
        "Polling Station Executives",
        "Member of Parliament",
        "District Chief Executive",
        "Municipal Chief Executive",
        "Metropolitan Chief Executive",
      ],
    },
    position: { type: String },

    // ✅ Electoral Area & Polling Station
    electoralAreaName: { type: String },
    pollingStationName: { type: String },
    pollingStationCode: { type: String }, // ✅ NEW — added for matching and prediction

    // ✅ Term info
    termStart: { type: String },
    termEnd: { type: String },
    termStartDate: { type: String },
    termEndDate: { type: String },

    // ✅ Slug keys
    regionKey: { type: String },
    constituencyKey: { type: String },
    electoralAreaKey: { type: String },
    positionKey: { type: String },

    // ✅ Active status
    isActive: { type: Boolean, default: true },
  },
  { _id: false } // Prevent MongoDB from adding a nested _id to `role`
);

// ✅ Main User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    // ✅ Identification
    ghanaCard: { type: String, required: true, unique: true },
    voterId: { type: String },
    partyCard: { type: String },
    email: { type: String },

    // ✅ Location
    region: { type: String, required: true },
    constituency: { type: String, required: true },

    // ✅ Photo & flags
    photo: { type: String },
    isOfficial: { type: Boolean, default: false },

    // ✅ Authentication
    passwordHash: { type: String, required: false },

    // ✅ Role (nested)
    role: roleSchema,
  },
  { timestamps: true }
);

// ✅ Indexes for search optimization
userSchema.index({
  "role.unit": 1,
  "role.regionKey": 1,
  "role.constituencyKey": 1,
  "role.electoralAreaKey": 1,
  "role.positionKey": 1,
  "role.isActive": 1,
});

export const User = mongoose.model("User", userSchema);
