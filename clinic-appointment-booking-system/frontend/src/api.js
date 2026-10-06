const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const text = await response.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }
  if (!response.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

export const api = {
  health: () => request("/health"),
  register: (body) => request("/users/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/users/login", { method: "POST", body: JSON.stringify(body) }),
  doctors: () => request("/doctors"),
  appointments: () => request("/appointments"),
  patientAppointments: (id) => request(`/appointments/patient/${id}`),
  book: (body) => request("/appointments", { method: "POST", body: JSON.stringify(body) }),
  updateStatus: (id, value) => request(`/appointments/${id}/status?value=${encodeURIComponent(value)}`, { method: "PUT" }),
  cancel: (id) => request(`/appointments/${id}`, { method: "DELETE" })
};
