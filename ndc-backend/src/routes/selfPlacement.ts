// ndc-backend/src/routes/selfPlacement.ts
import { Router, Response } from "express";
import { User } from "../models/User";
import upload from "../middleware/uploadMiddleware";
import type { MulterRequest } from "../types/express";

// ✅ Slugify helper for keys
const slugKey = (s: string) =>
  s
    ? s
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : "";

const router = Router();

router.post(
  "/self-placement",
  upload.single("photo"),
  async (req: MulterRequest, res: Response) => {
    try {
      const {
        name,
        ghanaCard,
        voterId,
        partyCard,
        email,
        region,
        constituency,
        isOfficial,
        scope,
        unit,
        position,
        electoralAreaName,
        pollingStationName,
        pollingStationCode,
        termStartDate,
        termEndDate,
      } = req.body;

      if (!name || !region || !constituency) {
        return res
          .status(400)
          .json({ ok: false, error: "Missing required fields." });
      }

      // ✅ Handle photo only for officials
      const photo =
        isOfficial === "true" || isOfficial === true
          ? req.file?.filename || ""
          : "";

      // ✅ Slug keys
      const regionKey = slugKey(region);
      const constituencyKey = slugKey(constituency);
      const electoralAreaKey = slugKey(electoralAreaName || "");
      const positionKey = slugKey(position || "");

      // ✅ Build role object
      const role =
        isOfficial === "true" || isOfficial === true
          ? {
              scope,
              unit,
              position,
              region,
              constituency,
              electoralAreaName: electoralAreaName || undefined,
              pollingStationName: pollingStationName || undefined,
              pollingStationCode: pollingStationCode || undefined,
              termStart: termStartDate || null,
              termEnd: termEndDate || null,
              termStartDate: termStartDate || null,
              termEndDate: termEndDate || null,
              regionKey,
              constituencyKey,
              electoralAreaKey,
              positionKey,
              isActive: true,
            }
          : undefined;

      // ✅ Create new user
      const user = new User({
        name,
        ghanaCard,
        voterId,
        partyCard,
        email,
        region,
        constituency,
        photo,
        isOfficial: isOfficial === "true" || isOfficial === true,
        role,
      });

      await user.save();

      // ✅ Build redirect path for Electoral Area Coordinators
      let redirectPath = "";
      if (
        user.isOfficial &&
        user.role?.unit === "Electoral Area Coordinators" &&
        user.role?.electoralAreaName
      ) {
        redirectPath = `/regions/${regionKey}/constituencies/${constituencyKey}/c-dinators/${electoralAreaKey}-c-dinators`;
      }

      res.status(201).json({ ok: true, data: user, redirectPath });
    } catch (err) {
      console.error("❌ POST /self-placement error:", err);
      res.status(500).json({ ok: false, error: "Self-placement failed." });
    }
  }
);

export default router;
