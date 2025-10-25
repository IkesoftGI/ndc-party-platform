// ndc-backend/src/routes/users.ts

import { Router, Request, Response } from "express";
import { User } from "../models/User";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = Router();

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// ✅ Cloudinary storage engine for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file): Promise<any> => ({
    folder: "ndc-platform/uploads",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    transformation: [{ width: 600, height: 600, crop: "limit" }], // optimize image size
  }),
});

const upload = multer({ storage });

// ---------------------------------------------------------
// GET /api/users → List all or filtered users
// ---------------------------------------------------------
router.get("/", async (req: Request, res: Response) => {
  try {
    const { region, constituency } = req.query;
    const query: Record<string, any> = {};
    if (region) query.region = new RegExp(`^${region}$`, "i");
    if (constituency) query.constituency = new RegExp(`^${constituency}$`, "i");

    const users = await User.find(query).lean();
    res.json({ ok: true, data: users });
  } catch (err) {
    console.error("GET /users error:", err);
    res.status(500).json({ ok: false, error: "Internal Server Error" });
  }
});

// ---------------------------------------------------------
// GET /api/users/:id → Get one user
// ---------------------------------------------------------
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ ok: false, error: "User not found" });
    res.json({ ok: true, data: user });
  } catch (err) {
    console.error("GET /users/:id error:", err);
    res.status(500).json({ ok: false, error: "Internal Server Error" });
  }
});

// ---------------------------------------------------------
// POST /api/users → Create user with Cloudinary photo upload
// ---------------------------------------------------------
router.post("/", upload.single("photo"), async (req: Request, res: Response) => {
  try {
    const { name, ghanaCard, region, constituency, voterId, partyCard, email } = req.body;

    if (!name || !ghanaCard || !region || !constituency) {
      console.log("POST /users received body:", req.body);
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }

    const exists = await User.findOne({ ghanaCard });
    if (exists)
      return res.status(409).json({ ok: false, error: "User with this Ghana Card already exists" });

    const photoUrl = req.file?.path || ""; // ✅ Cloudinary auto-adds .path with full URL

    const user = new User({
      name,
      ghanaCard,
      voterId: voterId || "",
      partyCard: partyCard || "",
      email: email || "",
      region,
      constituency,
      photo: photoUrl,
      isOfficial: req.body.isOfficial === "true" || req.body.isOfficial === true,
    });

    await user.save();
    res.status(201).json({ ok: true, data: user });
  } catch (err) {
    console.error("POST /users error:", err);
    res.status(500).json({ ok: false, error: "Internal Server Error" });
  }
});

// ---------------------------------------------------------
// PUT /api/users/:id/role → Assign a role to user
// ---------------------------------------------------------
router.put("/:id/role", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      scope,
      unit,
      position,
      electoralAreaName,
      pollingStationName,
      pollingStationCode,
      termStart,
      termEnd,
      termStartDate,
      termEndDate,
      isActive,
    } = req.body;

    if (!scope || !unit || !position) {
      return res.status(400).json({ ok: false, error: "Missing role fields" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ ok: false, error: "User not found" });

    // ✅ Normalize and assign
    user.role = {
      scope,
      unit,
      position,
      electoralAreaName: electoralAreaName || "",
      pollingStationName: pollingStationName || "",
      pollingStationCode: pollingStationCode || "",
      termStart: termStart || "",
      termEnd: termEnd || "",
      termStartDate: termStartDate || "",
      termEndDate: termEndDate || "",
      isActive: isActive ?? true,
      regionKey: user.region.replace(/\s+/g, "-").toLowerCase(),
      constituencyKey: user.constituency.replace(/\s+/g, "-").toLowerCase(),
      electoralAreaKey: electoralAreaName
        ? electoralAreaName.replace(/\s+/g, "-").toLowerCase()
        : "",
      positionKey: position.replace(/\s+/g, "-").toLowerCase(),
    };

    user.isOfficial = req.body.isOfficial === "true" || req.body.isOfficial === true;

    await user.save();
    res.json({ ok: true, data: user });
  } catch (err) {
    console.error("PUT /users/:id/role error:", err);
    res.status(500).json({ ok: false, error: "Internal Server Error" });
  }
});

// ---------------------------------------------------------
// POST /api/users/seed → Create sample users
// ---------------------------------------------------------
router.post("/seed", async (_req, res) => {
  try {
    const samples = [
      {
        name: "Ama Mensah",
        ghanaCard: "GHA-123456789-0",
        voterId: "5269024000",
        partyCard: "NPP-GAK-1234567890",
        email: "ama.mensah@example.com",
        region: "Greater Accra",
        constituency: "Dome-Kwabenya",
        isOfficial: true,
        photo: "",
      },
      {
        name: "Kofi Boateng",
        ghanaCard: "GHA-987654321-1",
        voterId: "5269024001",
        partyCard: "NPP-ASH-9876543210",
        email: "kofi.boateng@example.com",
        region: "Ashanti",
        constituency: "Asawase",
        isOfficial: true,
        photo: "",
      },
      {
        name: "Bibi Oforiwaa",
        ghanaCard: "GHA-112233445-0",
        voterId: "5269024002",
        partyCard: "NPP-CR-1122334455",
        email: "bibi.oforiwaa@example.com",
        region: "Central",
        constituency: "Cape Coast South",
        isOfficial: false,
        photo: "",
      },
    ];

    const created = await User.insertMany(samples);
    res.json({ ok: true, data: created });
  } catch (err) {
    console.error("POST /users/seed error:", err);
    res.status(500).json({ ok: false, error: "Internal Server Error" });
  }
});

// ---------------------------------------------------------
// DELETE /api/users/reset → Remove all users
// ---------------------------------------------------------
router.delete("/reset", async (_req, res) => {
  try {
    await User.deleteMany({});
    res.json({ ok: true, data: [] });
  } catch (err) {
    console.error("DELETE /users/reset error:", err);
    res.status(500).json({ ok: false, error: "Internal Server Error" });
  }
});

// ---------------------------------------------------------
// DELETE /api/users/purge → Remove and return count
// ---------------------------------------------------------
router.delete("/purge", async (_req, res) => {
  try {
    const result = await User.deleteMany({});
    res.json({ ok: true, deletedCount: result.deletedCount });
  } catch (error) {
    console.error("❌ Purge failed:", error);
    res.status(500).json({ ok: false, error: "Failed to purge users." });
  }
});

export default router;
