import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchProtectedData, getInventario, getUserById } from "../services/api";
import Facturar from "./Facturar";
import SubirInventario from "./SubirInventario";
import Inventario from "./Inventario";
import "@fortawesome/fontawesome-free/css/all.min.css"; // 👈 si usas FontAwesome vía npm
import UserProfile from "./UserProfile";
import EditarPerfil from "./EditarPerfil";

const Dashboard = () => {
  const { logout, token } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [selectedPanel, setSelectedPanel] = useState("inicio");
  const [inventory, setInventory] = useState([]);

  
    useEffect(() => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?._id; // o user?.id según tu backend
  
      if (!token || !userId) {
        setError("No hay sesión activa");
        return;
      }
  
      const fetchProfile = async () => {
        try {
          const data = await getUserById(token, userId);
          setUser(data);
        } catch (err) {
          setError(err.message);
        }
      };
  
      fetchProfile();
    }, [token]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchProtectedData(token);
        setData(response);
        setUser(response.user);
        const inventoryData = await getInventario(token);
        setInventory(inventoryData);
      } catch (err) {
        setError("No autorizado o error al cargar datos");
      }
    };
    if (token) loadData();
  }, [token]);

  const renderPanel = () => {
    switch (selectedPanel) {
      case "inicio":
        return (
          <div className="dashboard-card">
            <h3>Bienvenido, {user.usuario}</h3>
            <p>Email: {user.correo}</p>
          </div>
        );
      case "inventario":
        return <Inventario token={token} />;
      case "facturar":
        return <Facturar />;
      case "subirInventario":
        return (
          <SubirInventario
            token={token}
            onProductoAgregado={() => {
              getInventario(token).then(setInventory);
              setSelectedPanel("inventario");
            }}
          />
        );
        case "perfil":
          return<UserProfile/>;
        case "editarPerfil":
          return<EditarPerfil/>;  
      default:
        return null;
    }
  };

  if (error) return <p>{error}</p>;
  if (!data || !user) return <p>Cargando...</p>;

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
          <li onClick={() => setSelectedPanel("subirInventario")}>
            <i className="fas fa-upload"></i> Subir inventario
          </li>
          <li onClick={() => setSelectedPanel("facturar")}>
            <i className="fas fa-file-invoice-dollar"></i> Facturar
          </li>
          <li onClick={() => setSelectedPanel("perfil")}>
            <i className="fas fa-user"></i> Mi Perfil
          </li>
          <li onClick={() => setSelectedPanel("editarPerfil")}>
            <i className="fas fa-user"></i> Editar Perfil
          </li>
          <li onClick={logout}>
            <i className="fas fa-sign-out-alt"></i> Cerrar sesión
          </li>
        </ul>
      </aside>

      <main className="main-panel">
        <div className="main-header">
          <h2>
            {selectedPanel === "inicio" && "Inicio"}
            {selectedPanel === "inventario" && "Inventario"}
            {selectedPanel === "subirInventario" && "Subir Inventario"}
            {selectedPanel === "facturar" && "Facturar"}
          </h2>
          <button onClick={logout}>
            <i className="fas fa-sign-out-alt"></i> Salir
          </button>
        </div>

        {renderPanel()}
      </main>
    </div>
  );
};

export default Dashboard;
