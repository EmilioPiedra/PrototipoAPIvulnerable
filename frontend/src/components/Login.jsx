import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginAPI } from "../services/api";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRecuperarContrasena = (e) => {
    e.preventDefault();
    navigate("/recuperar-contrasena");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await loginAPI(usuario, password);
      login(data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Ingresar</button>

      <a
        href="#"
        onClick={handleRecuperarContrasena}
        style={{
          marginTop: "10px",
          display: "inline-block",
          cursor: "pointer",
          color: "blue",
          textDecoration: "underline",
        }}
      >
        ¿Olvidaste tu contraseña??
      </a>

      {error && <p>{error}</p>}
    </form>
  );
};

export default Login;
