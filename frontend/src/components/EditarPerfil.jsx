import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
// 1. IMPORTAR LAS FUNCIONES NUEVAS Y SEGURAS
import { getUserProfile, updateUserProfile } from "../services/api";

const EditarPerfil = ({ user: userProp }) => {
  const { token } = useContext(AuthContext);
  // Si nos pasan el usuario por props (desde Dashboard), lo usamos de una. Si no, null.
  const [user, setUser] = useState(userProp || null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(!userProp);

  // Cargar datos del usuario si no vinieron en las props
  useEffect(() => {
    if (userProp) {
        setUser(userProp);
        setLoading(false);
        return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?._id;
    
    if (!userId || !token) {
        setError("No se pudo identificar al usuario");
        setLoading(false);
        return;
    }

    // 2. USAR LA FUNCIÓN SEGURA
    getUserProfile(token, userId)
      .then((data) => {
          setUser(data);
          setLoading(false);
      })
      .catch((err) => {
          setError(err.message || "Error al cargar datos");
          setLoading(false);
      });
  }, [token, userProp]);

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
      
      // Opcional: Filtramos solo lo que queremos enviar (Buenas prácticas)
      const datosAEnviar = {
          correo: user.correo,
          telefono: user.telefono,
          // Nota: El backend seguro ignora 'usuario' y 'cedula' si no es admin, 
          // pero no hace daño enviarlos.
          usuario: user.usuario, 
          cedula: user.cedula 
      };

      // 3. USAR LA FUNCIÓN SEGURA DE UPDATE
      const updated = await updateUserProfile(token, userId, datosAEnviar);
      
      setMensaje(updated.message || "Perfil actualizado correctamente");
      // Actualizar el estado con la respuesta fresca del servidor
      setUser(updated.user); 
      
    } catch (err) {
      setError(err.message || "Error al actualizar el usuario");
    }
  };

  if (loading) return <p>Cargando perfil...</p>;
  if (!user) return <p>No se encontraron datos del usuario.</p>;

  return (
    <div className="perfil-container">
      <h2>Editar Perfil</h2>

      {mensaje && <p className="success-msg" style={{color: 'green'}}>{mensaje}</p>}
      {error && <p className="error-msg" style={{color: 'red'}}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Usuario suele ser de solo lectura en muchos sistemas, pero si tu back lo permite: */}
        <div className="form-group">
            <label>Usuario:</label>
            <input 
                name="usuario" 
                value={user.usuario || ""} 
                onChange={handleChange} 
                disabled // Sugerencia: Deshabilitar editar username es más seguro
                title="El nombre de usuario no se puede cambiar"
            />
        </div>

        <div className="form-group">
            <label>Correo:</label>
            <input name="correo" type="email" value={user.correo || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
            <label>Cédula:</label>
            <input name="cedula" value={user.cedula || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
            <label>Teléfono:</label>
            <input name="telefono" value={user.telefono || ""} onChange={handleChange} />
        </div>

        <button type="submit" className="btn-save">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditarPerfil;