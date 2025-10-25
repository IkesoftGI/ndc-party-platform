// ndc-backend\src\utils\auth.tsa

import bcrypt from "bcryptjs";
import jwt, { SignOptions, Secret } from "jsonwebtoken";

export async function hashPassword(plain: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

export async function comparePassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export function signToken(
  payload: string | object | Buffer,
  secret: Secret,
  expiresIn: SignOptions["expiresIn"] = "7d"
): string {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, secret, options);
}
