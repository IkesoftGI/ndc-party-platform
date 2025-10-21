// src/api/config.ts

const isDev = import.meta.env.DEV;

export const API_BASE_URL = isDev
  ? "http://localhost:5000"
  : "https://npp-backend.onrender.com";

console.log("✅ Using API_BASE_URL:", API_BASE_URL);
