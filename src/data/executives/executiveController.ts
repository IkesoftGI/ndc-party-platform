// src/data/executives/executiveController.ts
import axios from "axios";
import { API_BASE_URL } from "@api/config";
import type { User } from "@api/users";

const norm = (s?: string) => (s || "").toLowerCase().replace(/-/g, " ").trim();

/**
 * ✅ Fetch all users from backend
 */
async function fetchAllUsers(): Promise<User[]> {
  const res = await axios.get(`${API_BASE_URL}/api/users`);
  const data = res.data?.data || res.data || [];
  return Array.isArray(data) ? data : [];
}

/**
 * ✅ Fetch all National Executives
 */
export async function getNationalExecutives(): Promise<User[]> {
  const users = await fetchAllUsers();
  return users.filter(
    (u) =>
      norm(u.role?.unit) === "national executives" &&
      norm(u.role?.scope) === "national"
  );
}

/**
 * ✅ Fetch all National Council of Elders
 */
export async function getNationalElders(): Promise<User[]> {
  const users = await fetchAllUsers();
  return users.filter(
    (u) =>
      norm(u.role?.unit) === "national council of elders" &&
      norm(u.role?.scope) === "national"
  );
}

/**
 * ✅ Fetch all Regional Executives
 */
export async function getRegionalExecutives(region: string): Promise<User[]> {
  const users = await fetchAllUsers();
  const r = norm(region);
  return users.filter(
    (u) =>
      norm(u.role?.unit) === "regional executives" && norm(u.region) === r
  );
}

/**
 * ✅ Fetch all Regional Council of Elders
 */
export async function getRegionalElders(region: string): Promise<User[]> {
  const users = await fetchAllUsers();
  const r = norm(region);
  return users.filter(
    (u) =>
      norm(u.role?.unit) === "regional council of elders" && norm(u.region) === r
  );
}

/**
 * ✅ Fetch all Constituency Executives
 */
export async function getConstituencyExecutives(
  region: string,
  constituency: string
): Promise<User[]> {
  const users = await fetchAllUsers();
  const r = norm(region);
  const c = norm(constituency);
  return users.filter(
    (u) =>
      norm(u.role?.unit) === "constituency executives" &&
      norm(u.region) === r &&
      norm(u.constituency) === c
  );
}

/**
 * ✅ Fetch all Constituency Council of Elders
 */
export async function getConstituencyElders(
  region: string,
  constituency: string
): Promise<User[]> {
  const users = await fetchAllUsers();
  const r = norm(region);
  const c = norm(constituency);
  return users.filter(
    (u) =>
      norm(u.role?.unit) === "constituency council of elders" &&
      norm(u.region) === r &&
      norm(u.constituency) === c
  );
}
