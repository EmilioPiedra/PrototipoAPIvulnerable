import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ allowedRoles }) => {
  const { token, userData, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Cargando...</div>; // O un Spinner
  }

  // 1. Si no hay token, mandar al Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si la ruta requiere roles específicos y el usuario no tiene ese rol
  if (allowedRoles && !allowedRoles.includes(userData?._userInfo?.rango)) {
    // Si intenta entrar a admin siendo user, lo mandamos a su dashboard normal
    // O a una página de "403 No Autorizado"
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Si pasa todas las validaciones, renderizar la ruta hija (Outlet)
  return <Outlet />;
};

export default PrivateRoute;