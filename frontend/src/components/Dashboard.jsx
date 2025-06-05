import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchProtectedData, getInventario } from "../services/api";


const Dashboard = () => {
  const { logout, token } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [selectedPanel, setSelectedPanel] = useState("inicio");

  const [image, setImage] = useState(null);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchProtectedData(token);
        setData(response);
        setUser(response.user);
        // Simulación de inventario
        const inventoryData = await getInventario(token);
        setInventory(inventoryData);
      } catch (err) {
        setError("No autorizado o error al cargar datos");
      }
    };

    if (token) loadData();
  }, [token]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleImageSubmit = (e) => {
    e.preventDefault();
    if (!image) return alert("Selecciona una imagen primero");
    alert(`Imagen "${image.name}" enviada (simulación)`);
    setImage(null);
  };

  const renderPanel = () => {
    switch (selectedPanel) {
      case "inicio":
        return (
          <div>
            <h2>Bienvenido, {user.name}</h2>
            <p>Email: {user.email}</p>
          </div>
        );
      case "notificar":
        return (
          <div>
            <h2>Notificar producto dañado</h2>
            <form onSubmit={handleImageSubmit} className="image-form">
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <button type="submit">Enviar imagen</button>
              {image && <p>Seleccionado: {image.name}</p>}
            </form>
          </div>
        );
      case "inventario":
        return (
          <div>
            <h2>Inventario</h2>
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Categoria</th>
                  <th>Cantidad</th>
                  <th>Descripcion</th>
                  <th>Ubicacion</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.nombre}</td>
                    <td>{item.categoria}</td>
                    <td>{item.cantidad}</td>
                    <td>{item.descripcion}</td>
                    <td>{item.ubicacion}</td>
                    <td>{item.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
        <h3>Empleado</h3>
        <ul>
          <li onClick={() => setSelectedPanel("inicio")}>Inicio</li>
          <li onClick={() => setSelectedPanel("notificar")}>Notificar daño</li>
          <li onClick={() => setSelectedPanel("inventario")}>Inventario</li>
          <li onClick={logout}>Cerrar sesión</li>
        </ul>
      </aside>

      <main className="main-panel">
        {renderPanel()}
      </main>
    </div>
  );
};

export default Dashboard;
