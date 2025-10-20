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

export const getUsers = async (token) => {
  const res = await fetch(`${API_URL}/api/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("No autorizado o usuario no encontrado");
  return await res.json();
};

export const updateUser = async (usuario, newData, token) => {
  const res = await fetch(`${API_URL}/api/actualizar/${usuario}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newData),
  });

  if (!res.ok) throw new Error("Error al actualizar usuario");

  return await res.json();
};

export const deleteUser = async (usuario, token) => {
  const res = await fetch(`${API_URL}/api/eliminar/${usuario}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al eliminar usuario");
  return await res.json();
}

export const getInventario = async (token) => {
  const res = await fetch(`${API_URL}/api/inventario`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("No autorizado o inventario no encontrado");
  return await res.json();
};

export const addInventario = async (token, nuevoItem) => {
  const res = await fetch(`${API_URL}/api/addInventario`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(nuevoItem),
  });

  if (!res.ok) throw new Error("Error al agregar producto al inventario");
  return await res.json();
};


export const verificarAntecedentes = async (cedula, token) => {
  const res = await fetch(`${API_URL}/api/verificar-antecedentes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ cedula }),
  });

  const data = await res.json();
  return data;
};


export const facturarCliente = async (factura, token) => {
  const res = await fetch(`${API_URL}/api/factura`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(factura)
  });

  if (!res.ok) throw new Error("Error al generar la factura");
  return await res.json();
};


export const getUserById = async (id, token) => {
  const res = await fetch(`${API_URL}/api/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error al obtener usuario: ${res.status} ${text}`);
  }
  return await res.json();
};
