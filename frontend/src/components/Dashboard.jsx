import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchProtectedData } from "../services/api";

const Dashboard = () => {
  const { logout, token } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchProtectedData(token);
        setData(response);
        // Suponiendo que la respuesta tiene un campo "user":
        setUser(response.user);
      } catch (err) {
        setError("No autorizado o error al cargar datos");
      }
    };

    if (token) loadData();
  }, [token]);

  if (error) return <p>{error}</p>;
  if (!data || !user) return <p>Cargando...</p>;

  return (
    <div className="dashboard-container">
      <h1>Bienvenidoo al Dashboarddd</h1>
      <p className="intro-text">Información</p>

      <div className="info-panel">
        <h2>Datos del usuario</h2>
        <p>Nombre: {user.name}</p>
        <p>Email: {user.email}</p>
        {/* Agrega más campos si los necesitas */}

        <button onClick={logout} className="logout-btn">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
