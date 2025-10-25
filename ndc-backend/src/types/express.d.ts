// ndc-backend\src\types\express.d.ts

import { Request } from "express";
import type { File } from "multer"; // only needed if you want to extend deeply

export interface MulterRequest extends Request {
  file?: Express.Multer.File;
}
