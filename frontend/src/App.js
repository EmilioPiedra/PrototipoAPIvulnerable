import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Componentes
import Login from "./components/Login";
import Dashboard from "./components/Dashboard"; // Vista de Usuario
import AdminDashboard from "./components/AdminDashboard"; // Vista de Admin
import RecuperarContrasena from "./components/RecuperarContrasena";
import PrivateRoute from "./components/PrivateRoute"; // Componente Guardián

// Estilos
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* === RUTAS PÚBLICAS === */}
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
          
          {/* Redirección raíz */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* === RUTAS PROTEGIDAS (ADMIN) === */}
          {/* Solo dejamos entrar si el rol es 'admin' */}
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>

          {/* === RUTAS PROTEGIDAS (USUARIO) === */}
          {/* Permitimos 'user' y también 'admin' (si el admin quiere ver la vista de usuario) */}
          <Route element={<PrivateRoute allowedRoles={['user', 'admin']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Aquí iría también la ruta de /perfil si la tienes */}
          </Route>

          {/* === CATCH ALL (404) === */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;