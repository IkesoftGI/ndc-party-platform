// src/pages/Admin/UsersPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { createUser, listUsers, updateUser, deleteUser, type User, type Role } from "../../api/users";
import { REGIONS, CONSTITUENCIES } from "../../data/ghRegions";

/** ------------------ Local User Type ------------------ */
interface LocalUser extends User {
  role: Role & {
    roleCategory?: string;
  };
}

const emptyUser: LocalUser = {
  name: "",
  ghanaCard: "",
  partyCard: "",
  voterId: "",
  region: "",
  constituency: "",
  photo: "",
  role: {
    position: "",
    roleCategory: "Member",
  },
};

/** ------------------ Role + Position dictionaries ------------------ */
const ROLE_CATEGORIES = [
  "National Executive",
  "Regional Executive",
  "Constituency Executive",
  "Council of Elders",
  "Electoral Area Coordinator",
  "Polling Station Executive",
  "Member",
] as const;

const POSITIONS: Record<string, string[]> = {
  "National Executive": [
    "Chairman",
    "General Secretary",
    "Treasurer",
    "Organizer",
    "Youth Organizer",
    "Women's Organizer",
    "Communications Director",
    "Vice Chairman",
  ],
  "Regional Executive": [
    "Chairman",
    "Secretary",
    "Treasurer",
    "Organizer",
    "Youth Organizer",
    "Women's Organizer",
    "Communications Director",
    "Vice Chairman",
  ],
  "Constituency Executive": [
    "Chairman",
    "Secretary",
    "Treasurer",
    "Organizer",
    "Youth Organizer",
    "Women's Organizer",
    "Communications Officer",
    "Vice Chairman",
  ],
  "Council of Elders": ["Chair", "Member", "Secretary"],
  "Electoral Area Coordinator": ["Coordinator"],
  "Polling Station Executive": [
    "Chairman",
    "Secretary",
    "Organizer",
    "Treasurer",
    "Women's Organizer",
    "Youth Organizer",
  ],
  Member: [],
};

const positionsFor = (rc: string) =>
  (POSITIONS[rc as keyof typeof POSITIONS] ?? ["Chairman", "Secretary", "Treasurer", "Organizer"]).slice();

/** ------------------ Component ------------------ */
export default function UsersPage() {
  const [users, setUsers] = useState<LocalUser[]>([]);
  const [supporter, setSupporter] = useState<LocalUser>({ ...emptyUser });

  const supporterConstituencies = useMemo(
    () => (supporter.region && CONSTITUENCIES[supporter.region]) || [],
    [supporter.region]
  );

  const [loading, setLoading] = useState(false);

  /** Load all users */
  async function load() {
    setLoading(true);
    try {
      const res = await listUsers({});
      const data = (res as any)?.data ?? res;
      setUsers(data?.data ?? data ?? []);
    } catch (e: any) {
      console.error("Failed to load users", e);
      alert("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  /** Handle input changes */
  const onSupporterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "position") {
      setSupporter((prev) => ({ ...prev, role: { ...prev.role, position: value } }));
    } else if (name === "roleCategory") {
      setSupporter((prev) => ({ ...prev, role: { ...prev.role, roleCategory: value } }));
    } else {
      setSupporter((prev) => ({ ...prev, [name]: value }));
    }
  };

  /** Submit supporter */
  const submitSupporter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supporter.name.trim()) return alert("Name required.");
    if (!supporter.ghanaCard.trim()) return alert("Ghana Card required.");
    if (!supporter.region || !supporter.constituency) return alert("Region and Constituency required.");

    try {
      const cleanUser = {
        ...supporter,
        role: {
          position: supporter.role?.position || "",
          roleCategory: supporter.role?.roleCategory || "Member",
        },
      };

      await createUser(cleanUser as any);
      setSupporter({ ...emptyUser });
      await load();
      alert("Supporter saved.");
    } catch (e: any) {
      console.error("Save failed", e);
      alert("Failed to save.");
    }
  };

  /** Delete user */
  const onDelete = async (id: string) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      await load();
    } catch {
      alert("Failed to delete.");
    }
  };

  const deleteAll = async () => {
    if (!window.confirm("⚠️ Delete ALL users? This cannot be undone.")) return;
    try {
      await fetch("http://localhost:5000/api/users", { method: "DELETE" });
      await load();
      alert("All users deleted.");
    } catch {
      alert("Failed to delete all users.");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">All Users</h2>

      <h5>Add Supporter</h5>
      <form className="row g-3 mb-4" onSubmit={submitSupporter}>
        <div className="col-md-4">
          <label className="form-label">Name*</label>
          <input name="name" value={supporter.name} onChange={onSupporterChange} className="form-control" required />
        </div>

        <div className="col-md-4">
          <label className="form-label">Ghana Card*</label>
          <input name="ghanaCard" value={supporter.ghanaCard} onChange={onSupporterChange} className="form-control" required />
        </div>

        <div className="col-md-4">
          <label className="form-label">Voter ID</label>
          <input name="voterId" value={supporter.voterId} onChange={onSupporterChange} className="form-control" />
        </div>

        <div className="col-md-4">
          <label className="form-label">Party Card</label>
          <input name="partyCard" value={supporter.partyCard} onChange={onSupporterChange} className="form-control" />
        </div>

        <div className="col-md-4">
          <label className="form-label">Region*</label>
          <select name="region" value={supporter.region} onChange={onSupporterChange} className="form-select" required>
            <option value="">Select Region</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Constituency*</label>
          <select
            name="constituency"
            value={supporter.constituency}
            onChange={onSupporterChange}
            className="form-select"
            required
            disabled={!supporter.region}
          >
            <option value="">Select Constituency</option>
            {supporterConstituencies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Role Category</label>
          <select
            name="roleCategory"
            value={supporter.role?.roleCategory || "Member"}
            onChange={onSupporterChange}
            className="form-select"
          >
            {ROLE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Position</label>
          <select
            name="position"
            value={supporter.role?.position || ""}
            onChange={onSupporterChange}
            className="form-select"
          >
            <option value="">Select Position</option>
            {positionsFor(supporter.role?.roleCategory || "Member").map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="col-12">
          <button className="btn btn-success">Save</button>
        </div>
      </form>

      <div className="mb-3">
        <button className="btn btn-danger" onClick={deleteAll}>Delete All Users</button>
      </div>

      <h5>Registered Users</h5>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Region</th>
            <th>Constituency</th>
            <th>Position</th>
            <th>Photo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.region}</td>
              <td>{u.constituency}</td>
              <td>{u.role?.position || "-"}</td>
              <td>
                {u.photo ? (
                  <img src={u.photo} alt="user" style={{ width: 50, height: 50, objectFit: "cover", borderRadius: "6px" }} />
                ) : ("-")}
              </td>
              <td>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(u._id!)}>Delete</button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr><td colSpan={6} className="text-center py-3">No users found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
