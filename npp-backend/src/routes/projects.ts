// npp-backend/src/routes/projects.ts
import { Router, Request, Response } from "express";
import multer from "multer";
import { Project } from "../models/Project";

const router = Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "public/uploads/"),
  filename: (_req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// POST /api/projects
router.post("/", upload.single("photo"), async (req: Request, res: Response) => {
  try {
    const { title, description, category, status, region, constituency, createdBy } = req.body;

    if (!title) {
      return res.status(400).json({ ok: false, error: "Project title is required" });
    }

    const project = new Project({
      title,
      description,
      category,
      status,
      region,
      constituency,
      createdBy,
      photo: req.file ? `/uploads/${req.file.filename}` : "",
    });

    await project.save();
    res.status(201).json({ ok: true, data: project });
  } catch (err) {
    console.error("POST /api/projects error:", err);
    res.status(500).json({ ok: false, error: "Failed to create project" });
  }
});

// GET /api/projects
router.get("/", async (req: Request, res: Response) => {
  try {
    const { region, constituency, status, category } = req.query;
    const query: any = {};

    if (region) query.region = new RegExp(`^${region}$`, "i");
    if (constituency) query.constituency = new RegExp(`^${constituency}$`, "i");
    if (status) query.status = String(status).toLowerCase();
    if (category) query.category = new RegExp(`^${category}$`, "i");

    const projects = await Project.find(query).sort({ createdAt: -1 }).lean();
    res.json({ ok: true, data: projects });
  } catch (err) {
    console.error("GET /projects error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch projects" });
  }
});

export default router;
