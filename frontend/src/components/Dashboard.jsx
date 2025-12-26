import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
// 1. IMPORTAR LAS FUNCIONES NUEVAS Y SEGURAS
import { getUserProfile, getInventario } from "../services/api"; 
import SubirInventario from "./SubirInventario";
import Inventario from "./Inventario";
import "@fortawesome/fontawesome-free/css/all.min.css"; 
import UserProfile from "./UserProfile";
import EditarPerfil from "./EditarPerfil";

const Dashboard = () => {
  const { logout, token, userData } = useContext(AuthContext); // Usamos userData del contexto si ya existe
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPanel, setSelectedPanel] = useState("inicio");

  // 2. UN SOLO EFECTO PARA CARGAR DATOS
  useEffect(() => {
    // Si no hay token, no intentamos cargar nada
    if (!token) return;

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Obtenemos el ID del usuario guardado en localStorage o Contexto
        // Nota: Asegúrate de que al hacer login guardaste el _id
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const userId = storedUser?._id;

        if (!userId) throw new Error("ID de usuario no encontrado");

        // A. Cargar Perfil Seguro (Anti-IDOR)
        const profileData = await getUserProfile(token, userId);
        setUser(profileData);

        // B. Cargar Inventario (Solo si es necesario al inicio, o puedes cargarlo al cambiar de tab)
        const inventoryData = await getInventario(token);
        setInventory(inventoryData);

      } catch (err) {
        console.error("Error cargando dashboard:", err);
        setError("Sesión expirada o error de conexión.");
        // Opcional: Si falla mucho, logout automático
        // logout(); 
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [token]);

  const renderPanel = () => {
    if (loading) return <p>Cargando panel...</p>;
    if (!user) return <p>Error al cargar usuario.</p>;

    switch (selectedPanel) {
      case "inicio":
        return (
          <div className="dashboard-card">
            <h3>Bienvenido, {user.usuario}</h3>
            <p>Email: {user.correo}</p>
            <p>Rol: {user._userInfo?.rango || "Usuario"}</p>
          </div>
        );
      case "inventario":
        return <Inventario token={token} />;
      case "perfil":
        return <UserProfile user={user} />; // Pasamos el user ya cargado
      case "editarPerfil":
        return <EditarPerfil user={user} />;  
      default:
        return null;
    }
  };

  if (error) return (
    <div className="error-container">
      <p>{error}</p>
      <button onClick={logout}>Volver al Login</button>
    </div>
  );

  return (
    <div className="employee-dashboard">
      <aside className="sidebar">
        <h3>Panel Empleado</h3>
        <ul>
          <li onClick={() => setSelectedPanel("inicio")}>
            <i className="fas fa-home"></i> Inicio
          </li>
          <li onClick={() => setSelectedPanel("inventario")}>
            <i className="fas fa-boxes"></i> Inventario
          </li>
          <li onClick={() => setSelectedPanel("perfil")}>
            <i className="fas fa-user"></i> Mi Perfil
          </li>
          <li onClick={() => setSelectedPanel("editarPerfil")}>
            <i className="fas fa-user-edit"></i> Editar Perfil
          </li>
          <li onClick={logout} style={{ marginTop: "auto", color: "#ff6b6b" }}>
            <i className="fas fa-sign-out-alt"></i> Cerrar sesión
          </li>
        </ul>
      </aside>

      <main className="main-panel">
        <div className="main-header">
          <h2>
            {selectedPanel === "inicio" && "Inicio"}
            {selectedPanel === "inventario" && "Gestión de Inventario"}
            {selectedPanel === "subirInventario" && "Agregar Producto"}
            {selectedPanel === "perfil" && "Mi Perfil"}
            {selectedPanel === "editarPerfil" && "Editar Datos"}
          </h2>
          <div className="user-info-header">
            <span>{user?.usuario}</span>
            <button onClick={logout} className="logout-btn">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>

        <div className="panel-content">
          {renderPanel()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;