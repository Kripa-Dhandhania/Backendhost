// server.js
import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import crypto from "crypto";

const app = express();
app.use(express.json());
app.use(express.static("public")); // serve frontend files

// Setup lowdb
const adapter = new JSONFile("db.json");
const defaultData = { patients: [], doctors: [], appointments: [] };
const db = new Low(adapter, defaultData);

await db.read();
db.data ||= defaultData;

// ---------- GET endpoints ----------
app.get("/api/patients", (req, res) => {
  res.json(db.data.patients);
});

app.get("/api/doctors", (req, res) => {
  res.json(db.data.doctors);
});

app.get("/api/appointments", (req, res) => {
  res.json(db.data.appointments);
});

// ---------- POST endpoints ----------
app.post("/api/patients", async (req, res) => {
  const { name, age } = req.body;
  if (!name || !age) {
    return res.status(400).json({ error: "Patient must have name and age" });
  }

  const newPatient = { id: crypto.randomUUID(), name, age };
  db.data.patients.push(newPatient);
  await db.write();

  console.log("🧑 Added patient:", newPatient);
  res.json({ status: "ok", data: newPatient });
});

app.post("/api/doctors", async (req, res) => {
  const { name, specialization } = req.body;
  if (!name || !specialization) {
    return res.status(400).json({ error: "Doctor must have name & specialization" });
  }

  const newDoctor = { id: crypto.randomUUID(), name, specialization };
  db.data.doctors.push(newDoctor);
  await db.write();

  console.log("👨‍⚕️ Added doctor:", newDoctor);
  res.json({ status: "ok", data: newDoctor });
});

app.post("/api/appointments", async (req, res) => {
  const { patientId, doctorId, date } = req.body;
  if (!patientId || !doctorId || !date) {
    return res.status(400).json({ error: "Appointment must have patientId, doctorId, and date" });
  }

  const newAppointment = { id: crypto.randomUUID(), patientId, doctorId, date };
  db.data.appointments.push(newAppointment);
  await db.write();

  console.log("📅 Added appointment:", newAppointment);
  res.json({ status: "ok", data: newAppointment });
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
