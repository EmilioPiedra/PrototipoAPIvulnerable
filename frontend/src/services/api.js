const API_URL = "http://localhost:4000/api"; // Asegúrate que apunte a /api

// Helper para manejar las peticiones y errores estandarizados
const apiCall = async (endpoint, method = "GET", body = null, token = null) => {
  const headers = { "Content-Type": "application/json" };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, config);
    const data = await res.json();

    if (!res.ok) {
      // Lanzamos el error que viene del backend (ej: "Token expirado", "Acceso denegado")
      throw new Error(data.error || data.message || "Error en la petición");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

// ==========================================
// 1. AUTENTICACIÓN (LOGIN 2FA)
// ==========================================

// Paso 1: Enviar credenciales -> Recibir tempToken
export const loginStep1 = async (usuario, password) => {
  return await apiCall("/login", "POST", { usuario, password });
};

// Paso 2: Enviar tempToken + OTP -> Recibir Token Final
export const loginStep2 = async (tempToken, otp) => {
  return await apiCall("/login/verify", "POST", { tempToken, otp });
};

// Verificar Token / Obtener Perfil (Ruta protegida base)
export const fetchProtectedData = async (token) => {
  return await apiCall("/protected", "GET", null, token);
};

// ==========================================
// 2. RECUPERACIÓN DE CONTRASEÑA
// ==========================================

export const requestPasswordReset = async (usuario) => {
  return await apiCall("/request-otp", "POST", { usuario });
};

export const verifyPasswordResetOtp = async (usuario, otp) => {
  return await apiCall("/verify-otp", "POST", { usuario, otp });
};

export const changePassword = async (usuario, otp, nuevaPassword) => {
  return await apiCall("/change-password", "POST", { usuario, otp, nuevaPassword });
};

// ==========================================
// 3. ADMINISTRACIÓN (Solo Admin)
// ==========================================

export const getUsers = async (token) => {
  return await apiCall("/users", "GET", null, token);
};

export const updateUserAdmin = async (token, usuarioTarget, data) => {
  return await apiCall(`/actualizar/${usuarioTarget}`, "PUT", data, token);
};

export const deleteUserAdmin = async (token, usuarioTarget) => {
  return await apiCall(`/eliminar/${usuarioTarget}`, "DELETE", null, token);
};

// ==========================================
// 4. INVENTARIO
// ==========================================

export const getInventario = async (token) => {
  return await apiCall("/inventario", "GET", null, token);
};

export const addInventario = async (token, itemData) => {
  return await apiCall("/addInventario", "POST", itemData, token);
};

// ==========================================
// 5. PERFIL DE USUARIO (Anti-IDOR)
// ==========================================

export const getUserProfile = async (token, id) => {
  return await apiCall(`/user/${id}`, "GET", null, token);
};

export const updateUserProfile = async (token, id, data) => {
  // data debería ser { correo, telefono } solamente
  return await apiCall(`/user/${id}`, "PUT", data, token);
};