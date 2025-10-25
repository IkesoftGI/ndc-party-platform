// ndc-backend/src/routes/officials.ts
import { Router, Request, Response } from "express";
import { User } from "../models/User";

const router = Router();

// -------------------------------------------
// GET /api/officials
// Fetch all officials with optional filters:
//   unitKey, regionKey, constituencyKey, electoralAreaKey, positionKey, isActive
// -------------------------------------------
router.get("/officials", async (req: Request, res: Response) => {
  try {
    const { unitKey, regionKey, constituencyKey, electoralAreaKey, positionKey, isActive } = req.query;
    const query: any = {};

    // Only fetch users who are marked as officials
    query.isOfficial = true;

    // Safe optional filters
    if (unitKey) query["role.unit"] = { $regex: `^${unitKey}$`, $options: "i" };
    if (regionKey) query["role.regionKey"] = String(regionKey).toLowerCase();
    if (constituencyKey) query["role.constituencyKey"] = String(constituencyKey).toLowerCase();
    if (electoralAreaKey) query["role.electoralAreaKey"] = String(electoralAreaKey).toLowerCase();
    if (positionKey) query["role.positionKey"] = String(positionKey).toLowerCase();
    if (isActive !== undefined) query["role.isActive"] = isActive === "true";

    const officials = await User.find(query).lean();
    res.json({ ok: true, data: officials });
  } catch (err) {
    console.error("❌ GET /officials error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch officials." });
  }
});


// -------------------------------------------
// GET /api/officials/:id
// Optional: fetch a single official by ID
// -------------------------------------------
router.get("/officials/:id", async (req: Request, res: Response) => {
  try {
    const official = await User.findOne({ _id: req.params.id, isOfficial: true }).lean();
    if (!official) return res.status(404).json({ ok: false, error: "Official not found" });
    res.json({ ok: true, data: official });
  } catch (err) {
    console.error("GET /officials/:id error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch official." });
  }
});

export default router;
