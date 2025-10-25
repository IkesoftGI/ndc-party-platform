// ndc-backend/server.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ---- health ----
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "ndc-backend", version: "0.1", time: new Date().toISOString() });
});

// ---- in-memory users store ----
let users = []; // [{ _id, name, ghanaCard, region, constituency, roleCategory, position, photo, ... }]
let seq = 1;

// list with optional filters (?region=&constituency=&roleCategory=&position=)
app.get("/api/users", (req, res) => {
  const { region, constituency, roleCategory, position } = req.query;
  let out = [...users];
  if (region) out = out.filter(u => u.region === region);
  if (constituency) out = out.filter(u => u.constituency === constituency);
  if (roleCategory) out = out.filter(u => u.roleCategory === roleCategory);
  if (position) out = out.filter(u => u.position === position);
  res.json({ ok: true, data: out });
});

// create
app.post("/api/users", (req, res) => {
  const body = req.body || {};
  if (!body.name || !body.ghanaCard || !body.region || !body.constituency || !body.roleCategory) {
    return res.status(400).json({ ok: false, error: "Missing required fields" });
  }
  const doc = { ...body, _id: String(seq++) };
  users.push(doc);
  res.status(201).json({ ok: true, data: doc });
});

// update
app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const idx = users.findIndex(u => u._id === id);
  if (idx === -1) return res.status(404).json({ ok: false, error: "Not found" });
  users[idx] = { ...users[idx], ...req.body };
  res.json({ ok: true, data: users[idx] });
});

// delete
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const idx = users.findIndex(u => u._id === id);
  if (idx === -1) return res.status(404).json({ ok: false, error: "Not found" });
  const removed = users.splice(idx, 1)[0];
  res.json({ ok: true, data: { id: removed._id } });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 ndc-backend running on http://localhost:${PORT}`));
