import React, { createContext, useState, useEffect } from 'react';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (jwt) => {
    localStorage.setItem('token', jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUserData(null);
  };

  
  return (
    <AuthContext.Provider value={{ token, userData, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
