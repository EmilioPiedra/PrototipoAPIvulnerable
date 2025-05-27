const API_URL = "http://localhost:4000"; // backend

export const login = async (usuario, password) => {
  const res = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, password }),
  });
  if (!res.ok) throw new Error("Credenciales inválidas");
  return await res.json(); // { token: "..." }
};

export const fetchProtectedData = async (token) => {
  const res = await fetch(`${API_URL}/api/protected`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("No autorizado");
  return await res.json();
};

export const getUserById = async (id, token) => {
  const res = await fetch(`${API_URL}/api/user/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("No autorizado o usuario no encontrado");
  return await res.json();
};

export const updateUser = async (id, userData, token) => {
  const res = await fetch(`${API_URL}/api/user/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error("No autorizado o usuario no encontrado");
  return await res.json();
}

export const requestOtp = async (usuario) => {
  const res = await fetch(`${API_URL}/api/request-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario }),
  });
  if (!res.ok) throw new Error("Error al solicitar OTP");
  return await res.json();
};

export const verifyOtp = async ({ usuario, otp, nuevaPassword }) => {
  const res = await fetch(`${API_URL}/api/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, otp }),
  });
  if (!res.ok) throw new Error("Error al verificar OTP");
  return await res.json();
};

export const changePassword = async ({ usuario, otp, nuevaPassword }) => {
  const res = await fetch(`${API_URL}/api/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, otp, nuevaPassword }),
  });
  if (!res.ok) throw new Error("Error al cambiar contraseña");
  return await res.json(); // { mensaje: "...", valido: true (opcional) }
};
