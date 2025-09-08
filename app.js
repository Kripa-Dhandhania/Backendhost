// ==================== PATIENT FORM ====================
document.getElementById("patientForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const patient = {
    name: form.name.value,
    age: form.age.value,
  };

  const res = await fetch("/api/patients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patient),
  });

  const data = await res.json();
  console.log("✅ Patient Saved:", data);
  form.reset();
  fetchPatients(); // refresh list
});

// ==================== DOCTOR FORM ====================
document.getElementById("doctorForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const doctor = {
    name: form.name.value,
    specialization: form.specialization.value,
  };

  const res = await fetch("/api/doctors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doctor),
  });

  const data = await res.json();
  console.log("✅ Doctor Saved:", data);
  form.reset();
  fetchDoctors(); // refresh list
});

// ==================== APPOINTMENT FORM ====================
document.getElementById("appointmentForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const appointment = {
    patientId: form.patientId.value,
    doctorId: form.doctorId.value,
    date: form.date.value,
  };

  const res = await fetch("/api/appointments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(appointment),
  });

  const data = await res.json();
  console.log("✅ Appointment Saved:", data);
  form.reset();
  fetchAppointments(); // refresh list
});

// ==================== FETCH + DISPLAY ====================
async function fetchPatients(query = "") {
  const res = await fetch("/api/patients");
  let patients = await res.json();

  if (query) {
    patients = patients.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  const list = document.getElementById("patientsList");
  list.innerHTML = patients
    .map(
      (p) => `
      <div class="p-3 border rounded shadow">
        <p><strong>Name:</strong> ${p.name}</p>
        <p><strong>Age:</strong> ${p.age}</p>
        <p><strong>ID:</strong> ${p.id}</p>
      </div>`
    )
    .join("");
}

async function fetchDoctors(query = "") {
  const res = await fetch("/api/doctors");
  let doctors = await res.json();

  if (query) {
    doctors = doctors.filter((d) =>
      d.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  const list = document.getElementById("doctorsList");
  list.innerHTML = doctors
    .map(
      (d) => `
      <div class="p-3 border rounded shadow">
        <p><strong>Name:</strong> ${d.name}</p>
        <p><strong>Specialization:</strong> ${d.specialization}</p>
        <p><strong>ID:</strong> ${d.id}</p>
      </div>`
    )
    .join("");
}

async function fetchAppointments(query = "") {
  const res = await fetch("/api/appointments");
  let appointments = await res.json();

  if (query) {
    appointments = appointments.filter((a) =>
      a.date.includes(query)
    );
  }

  const list = document.getElementById("appointmentsList");
  list.innerHTML = appointments
    .map(
      (a) => `
      <div class="p-3 border rounded shadow">
        <p><strong>Patient ID:</strong> ${a.patientId}</p>
        <p><strong>Doctor ID:</strong> ${a.doctorId}</p>
        <p><strong>Date:</strong> ${a.date}</p>
      </div>`
    )
    .join("");
}

// ==================== NAVBAR SEARCH ====================
function setupSearch(navSelector, fetchFn, placeholder) {
  const navItem = document.querySelector(navSelector);
  navItem.addEventListener("click", () => {
    let searchBox = document.getElementById("searchBox");
    if (!searchBox) {
      searchBox = document.createElement("div");
      searchBox.id = "searchBox";
      searchBox.className = "text-center my-6";
      searchBox.innerHTML = `
        <input type="text" id="searchInput" 
          placeholder="${placeholder}" 
          class="border px-3 py-2 rounded w-1/2"/>
      `;
      document.body.insertBefore(searchBox, document.querySelector("main"));
    }

    const input = document.getElementById("searchInput");
    input.oninput = () => fetchFn(input.value);
    fetchFn();
  });
}

setupSearch("nav a:nth-child(1)", fetchPatients, "Search patient by name...");
setupSearch("nav a:nth-child(2)", fetchDoctors, "Search doctor by name...");
setupSearch("nav a:nth-child(3)", fetchAppointments, "Search by appointment date...");

// ==================== INITIAL LOAD ====================
fetchPatients();
fetchDoctors();
fetchAppointments();
