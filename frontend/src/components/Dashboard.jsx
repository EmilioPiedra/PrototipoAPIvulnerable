import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchProtectedData, getInventario } from "../services/api";
import Facturar from "./Facturar";
import SubirInventario from "./SubirInventario";
import Inventario from "./Inventario";
import "@fortawesome/fontawesome-free/css/all.min.css"; // 👈 si usas FontAwesome vía npm

const Dashboard = () => {
  const { logout, token } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [selectedPanel, setSelectedPanel] = useState("inicio");
  const [inventory, setInventory] = useState([]);

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
            <h3>Bienvenido, {user.name}</h3>
            <p>Email: {user.email}</p>
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
