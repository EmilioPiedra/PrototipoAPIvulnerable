import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  fetchProtectedData,
  getUsers,
  deleteUser,
  updateUser,
  getInventario,
} from "../services/api";
import SubirInventario from "./SubirInventario";
import "bootstrap/dist/css/bootstrap.min.css";

const DashboardAdmin = () => {
  const { logout, token } = useContext(AuthContext);
  const [protectedData, setProtectedData] = useState(null);
  const [users, setUsers] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ correo: "", rango: "" });
  const [selectedPanel, setSelectedPanel] = useState("usuarios");

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProtectedData(token);
        const usersList = await getUsers(token);
        const inventarioList = await getInventario(token);
        setProtectedData(data);
        setUsers(usersList);
        setInventario(inventarioList);
      } catch (err) {
        setError("Error al cargar datos: " + err.message);
      }
    };
    if (token) loadData();
  }, [token]);

  const handleDelete = async (usuario) => {
    if (!window.confirm(`¿Eliminar usuario ${usuario}?`)) return;
    try {
      await deleteUser(usuario, token);
      setUsers(users.filter((u) => u.usuario !== usuario));
    } catch (err) {
      alert("Error al eliminar usuario: " + err.message);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditForm({
      correo: user.correo || "",
      rango: user._userInfo?.rango || "",
    });
  };

  const handleUpdate = async () => {
    try {
      await updateUser(
        editingUser.usuario,
        { correo: editForm.correo, rango: editForm.rango },
        token
      );
      const updatedUsers = await getUsers(token);
      setUsers(updatedUsers);
      setEditingUser(null);
    } catch (err) {
      alert("Error al actualizar usuario: " + err.message);
    }
  };

  const renderPanel = () => {
    switch (selectedPanel) {
      case "usuarios":
        return (
          <>
            <h2>Usuarios</h2>
            <ul className="list-group">
              {users.map((user) => (
                <li
                  key={user.usuario}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{user.usuario}</strong> -{" "}
                    {user._userInfo?.rango || "Sin rango"}
                    <br />
                    <small>{user.correo}</small>
                  </div>
                  <div>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEditClick(user)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(user.usuario)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        );
      case "inventario":
        return (
          <>
            <h2>Inventario</h2>
            <ul className="list-group">
              {inventario.map((item) => (
                <li key={item._id} className="list-group-item">
                  {item.nombre} — {item.cantidad} unidades — ${item.precio}
                </li>
              ))}
            </ul>
          </>
        );
      case "subirInventario":
        return (
          <>
            <h2>Subir Inventario</h2>
            <SubirInventario
              token={token}
              onProductoAgregado={async () => {
                const updated = await getInventario(token);
                setInventario(updated);
                setSelectedPanel("inventario");
              }}
            />
          </>
        );
      default:
        return null;
    }
  };

  if (error) return <p>{error}</p>;
  if (!protectedData) return <p>Cargando...</p>;

  return (
    <div className="container mt-5">
      <h1>Dashboard Administrador</h1>
      <div className="btn-group mb-4">
        <button onClick={() => setSelectedPanel("usuarios")} className="btn btn-outline-dark">
          Usuarios
        </button>
        <button onClick={() => setSelectedPanel("inventario")} className="btn btn-outline-dark">
          Inventario
        </button>
        <button onClick={() => setSelectedPanel("subirInventario")} className="btn btn-outline-dark">
          Subir Inventario
        </button>
      </div>

      {renderPanel()}

      <button className="btn btn-secondary mt-4" onClick={logout}>
        Cerrar sesión
      </button>

      {/* Modal editar usuario */}
      {editingUser && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Editar usuario: {editingUser.usuario}</h5>
                <button type="button" className="btn-close" onClick={() => setEditingUser(null)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Correo</label>
                  <input
                    type="email"
                    className="form-control"
                    value={editForm.correo}
                    onChange={(e) => setEditForm({ ...editForm, correo: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label>Rango</label>
                  <select
                    className="form-select"
                    value={editForm.rango}
                    onChange={(e) => setEditForm({ ...editForm, rango: e.target.value })}
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={handleUpdate} className="btn btn-success">
                  Guardar
                </button>
                <button onClick={() => setEditingUser(null)} className="btn btn-secondary">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;
