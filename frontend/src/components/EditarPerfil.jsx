import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserById, updateUserById } from "../services/api";

const EditarPerfil = () => {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user"))?._id;
    if (!userId) return;

    getUserById(token, userId)
      .then(setUser)
      .catch(() => setError("Error al cargar datos del usuario"));
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const userId = user._id;
      const updated = await updateUserById(token, userId, user);
      setMensaje(updated.message);
      setUser(updated.user);
    } catch {
      setError("Error al actualizar el usuario");
    }
  };

  if (!user) return <p>Cargando perfil...</p>;

  return (
    <div className="perfil-container">
      <h2>Editar Perfil</h2>

      {mensaje && <p className="success">{mensaje}</p>}
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Usuario:</label>
        <input name="usuario" value={user.usuario || ""} onChange={handleChange} />

        <label>Correo:</label>
        <input name="correo" value={user.correo || ""} onChange={handleChange} />

        <label>Cédula:</label>
        <input name="cedula" value={user.cedula || ""} onChange={handleChange} />

        <label>Teléfono:</label>
        <input name="telefono" value={user.telefono || ""} onChange={handleChange} />

        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditarPerfil;
