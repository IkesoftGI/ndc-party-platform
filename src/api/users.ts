// src/api/users.ts
import { API_BASE_URL } from "./config";

// ✅ Define Role type
export type Role = {
  scope?: string;
  unit?: string;
  position?: string;
  electoralAreaName?: string;
  pollingStationName?: string;
  pollingStationCode?: string;
  termStart?: string;
  termEnd?: string;
  termStartDate?: string;
  termEndDate?: string;
  isActive?: boolean;
  isOfficial?: boolean;
};

// ✅ Define full User type
export type User = {
  _id?: string;
  name: string;
  ghanaCard: string;
  voterId: string;
  partyCard: string;
  region: string;
  constituency: string;
  email?: string;
  photo?: string;
  isOfficial?: boolean;

  // ✅ Optional placement fields
  electoralAreaName?: string;
  pollingStationName?: string;
  pollingStationCode?: string;

  // ✅ Add nested role object
  role?: Role;
};

// ✅ Always build full backend URL dynamically
const BASE_URL = `${API_BASE_URL}/api`;

/**
 * Create user with FormData (supports photo upload)
 */
export async function createUser(formData: FormData) {
  console.log("📤 createUser() started…");

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    console.warn("⚠️ Upload timed out (20s)");
    controller.abort();
  }, 20000); // 20s timeout

  try {
    console.log("🌐 Sending POST to:", `${BASE_URL}/users`);
    const res = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      body: formData,
      credentials: "include",
      signal: controller.signal,
    });

    clearTimeout(timeout);
    console.log("✅ Response received, status:", res.status);

    if (!res.ok) {
      const msg = await res.text();
      console.error(`❌ ${res.url} failed:`, msg);
      throw new Error(msg || `HTTP ${res.status}`);
    }

    const json = await res.json();
    console.log("📦 Parsed JSON:", json);
    return json;
  } catch (err: any) {
    clearTimeout(timeout);
    console.error("❌ createUser() failed:", err);
    throw new Error(
      err.name === "AbortError"
        ? "Network timeout — please retry."
        : err.message || "Upload failed."
    );
  }
}

/**
 * Assign role (scope/unit/position) to official
 */
export async function assignRole(userId: string, role: Role) {
  const res = await fetch(`${BASE_URL}/users/${userId}/role`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(role),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/**
 * List all users or filter by any field
 */
export async function listUsers(params: Partial<User> = {}) {
  const q = new URLSearchParams(
    Object.entries(params)
      .filter(([_, v]) => v != null && String(v).trim() !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();

  const res = await fetch(`${BASE_URL}/users${q ? `?${q}` : ""}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/**
 * Update user data (excluding photo)
 */
export async function updateUser(id: string, data: Partial<User>) {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/**
 * Delete a user
 */
export async function deleteUser(id: string) {
  const res = await fetch(`${BASE_URL}/users/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
