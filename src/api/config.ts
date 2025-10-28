// src/api/config.ts

const isDev = import.meta.env.DEV;

export const API_BASE_URL = isDev
  ? "http://localhost:5000" // local backend for testing
  : "https://ndc-backend-tdsh.onrender.com"; // ✅ correct live NDC backend

console.log("✅ Using API_BASE_URL:", API_BASE_URL);
