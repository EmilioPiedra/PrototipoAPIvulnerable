import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchProtectedData, getUsers, updateUserAdmin, deleteUserAdmin } from '../services/api';
import "bootstrap/dist/css/bootstrap.min.css";

const DashboardAdmin = () => {
  const { logout, token } = useContext(AuthContext);
  const [protectedData, setProtectedData] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ correo: "", rango: "" });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProtectedData(token);
        const usersList = await getUsers(token);
        setProtectedData(data);
        setUsers(usersList);
      } catch (err) {
        setError("Error al cargar datos: " + err.message);
      }
    };

    if (token) loadData();
  }, [token]);

  const handleDelete = async (usuario) => {
      try {
        // Orden correcto: (token, usuarioTarget)
        await deleteUserAdmin(token, usuario); 
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
        // Orden correcto: (token, usuarioTarget, data)
        await updateUserAdmin(
          token,                          // 1. Token va primero
          editingUser.usuario,            // 2. Usuario Target va segundo
          { correo: editForm.correo, rango: editForm.rango } // 3. Datos van al final
        );
        
        const updatedUsers = await getUsers(token);
        setUsers(updatedUsers);
        setEditingUser(null);
      } catch (err) {
        alert("Error al actualizar usuario: " + err.message);
      }
    };

  if (error) return <p>{error}</p>;
  if (!protectedData || users.length === 0) return <p>Cargando...</p>;

  return (
    <div className="admin-dashboard container mt-5">
      <h1 className="admin-dashboard-title mb-4">Dashboard Admin</h1>

      <h2 className="admin-dashboard-subtitle mb-3">Usuarios</h2>
      <ul className="admin-dashboard-list list-group">
        {users.map((user) => (
          <li
            key={user.usuario || user.id}
            className="admin-dashboard-item list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{user.usuario}</strong> -{" "}
              {user._userInfo?.rango || "Sin rango"}
              <br />
              <small className="text-muted">{user.correo}</small>
            </div>
            <div>
              <button
                className="admin-dashboard-btn-edit btn btn-sm btn-outline-primary me-2"
                onClick={() => handleEditClick(user)}
              >
                Editar
              </button>
              <button
                className="admin-dashboard-btn-delete btn btn-sm btn-outline-danger"
                onClick={() => handleDelete(user.usuario)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button className="admin-dashboard-btn-logout btn btn-secondary mt-4" onClick={logout}>
        Cerrar sesión
      </button>

      {/* Modal para editar */}
      {editingUser && (
        <div
          className="admin-dashboard-modal modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Editar usuario: {editingUser.usuario}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingUser(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Correo</label>
                  <input
                    type="email"
                    className="form-control"
                    value={editForm.correo}
                    onChange={(e) =>
                      setEditForm({ ...editForm, correo: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Rango</label>
                  <select
                    className="form-select"
                    value={editForm.rango}
                    onChange={(e) =>
                      setEditForm({ ...editForm, rango: e.target.value })
                    }
                  >
                    <option value="admin">admin</option>
                    <option value="superadmin">user</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={handleUpdate} className="btn btn-success">
                  Guardar cambios
                </button>
                <button
                  onClick={() => setEditingUser(null)}
                  className="btn btn-secondary"
                >
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
