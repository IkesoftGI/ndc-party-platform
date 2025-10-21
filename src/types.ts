// src/types.ts

// ✅ Only import Express types when available (backend context)
type ExpressRequest =
  typeof import("express") extends { Request: infer R } ? R : any;

export interface Executive {
  id: string;
  name: string;
  position: string;
  img?: string;
  bio: string;
}

// ✅ Safe MulterRequest type (works in both frontend & backend)
export interface MulterRequest extends ExpressRequest {
  file?: File; // Browser File type (frontend-safe)
}
