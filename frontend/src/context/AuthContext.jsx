import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. Recuperar Token y Usuario del almacenamiento local al inicio
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [loading, setLoading] = useState(false);

  // 2. Función de Login (Se llama al FINAL del 2FA)
  const login = (jwt, user) => {
    localStorage.setItem('token', jwt);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(jwt);
    setUserData(user);
  };

  // 3. Función de Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ token, userData, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};