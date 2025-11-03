import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchProtectedData, getUserById, getInventario, createCompra  } from "../services/api";
import UserProfile from "./UserProfile";
import EditarPerfil from "./EditarPerfil";
import ComprarProductos from "./ComprarProductos";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Dashboard = () => {
  const { logout, token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [selectedPanel, setSelectedPanel] = useState("inicio");
  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const userId = storedUser?._id;
        if (!token || !userId) return setError("No hay sesión activa");

        const [profile, inventario] = await Promise.all([
          getUserById(token, userId),
          getInventario(token),
        ]);
        setUser(profile);
        setInventory(inventario);
      } catch (err) {
        setError("Error al cargar datos: " + err.message);
      }
    };
    if (token) init();
  }, [token]);

 

  const total = cart.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

 
  const renderPanel = () => {
    switch (selectedPanel) {
      case "inicio":
        return (
          <div>
            <h3>Bienvenido, {user.usuario}</h3>
            <p>Correo: {user.correo}</p>
          </div>
        );
      case "comprar":
        return <ComprarProductos />;
      case "perfil":
        return <UserProfile />;
      case "editarPerfil":
        return <EditarPerfil />;
      default:
        return null;
    }
  };

  if (error) return <p>{error}</p>;
  if (!user) return <p>Cargando...</p>;

  return (
    <div className="employee-dashboard">
      <aside className="sidebar">
        <h3>Panel Empleado</h3>
        <ul>
          <li onClick={() => setSelectedPanel("inicio")}>
            <i className="fas fa-home"></i> Inicio
          </li>
          <li onClick={() => setSelectedPanel("comprar")}>
            <i className="fas fa-shopping-cart"></i> Comprar Productos
          </li>
          <li onClick={() => setSelectedPanel("perfil")}>
            <i className="fas fa-user"></i> Mi Perfil
          </li>
          <li onClick={() => setSelectedPanel("editarPerfil")}>
            <i className="fas fa-user-edit"></i> Editar Perfil
          </li>
          <li onClick={logout}>
            <i className="fas fa-sign-out-alt"></i> Cerrar sesión
          </li>
        </ul>
      </aside>

      <main className="main-panel">
        {renderPanel()}
      </main>
    </div>
  );
};

export default Dashboard;
