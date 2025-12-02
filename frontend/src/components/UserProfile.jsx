import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserProfile, updateUserProfile } from '../services/api';
const UserProfile = () => {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?._id; // o user?.id según tu backend

    if (!token || !userId) {
      setError("No hay sesión activa");
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(token, userId);
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, [token]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>Cargando perfil...</p>;

  return (
    <div className="profile-container">
      <h2>Perfil del Usuario</h2>
      <div className="profile-card">
        <p><strong>Usuario:</strong> {user.usuario}</p>
        <p><strong>Correo:</strong> {user.correo}</p>
        <p><strong>Cédula:</strong> {user.cedula}</p>
        <p><strong>Teléfono:</strong> {user.telefono}</p>
        <p><strong>Rango:</strong> {user._userInfo?.rango}</p>
        <p><strong>Créditos:</strong> {user._userInfo?.creditos}</p>
        <p><strong>Creado en:</strong> {new Date(user.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default UserProfile;