import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
// Importamos las nuevas funciones de tu api.js refactorizado
import { loginStep1, loginStep2 } from "../services/api"; 
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  // Estados para inputs
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(""); // Nuevo estado para el código

  // Estados de control de flujo
  const [step, setStep] = useState(1); // 1 = Credenciales, 2 = OTP
  const [tempToken, setTempToken] = useState(null); // Token temporal del paso 1
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRecuperarContrasena = (e) => {
    e.preventDefault();
    navigate("/recuperar-contrasena");
  };

  // Manejo del Submit (Inteligente: decide qué paso ejecutar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (step === 1) {
        // === PASO 1: ENVIAR CREDENCIALES ===
        const data = await loginStep1(usuario, password);
        
        // Si todo sale bien, el backend nos da un tempToken
        setTempToken(data.tempToken);
        setStep(2); // Cambiamos la vista al Paso 2 (OTP)
        // Opcional: Mostrar mensaje flash "Código enviado"
      } else {
        // === PASO 2: ENVIAR OTP ===
        const data = await loginStep2(tempToken, otp);
        
        // ¡ÉXITO TOTAL!
        // 1. Guardar en Contexto y LocalStorage
        login(data.token, data.user);

        // 2. Redirigir según Rango (Tu lógica original)
        const rango = data.user?._userInfo?.rango;
        if (rango === "admin") {
          navigate("/admin-dashboard");
        } else if (rango === "user") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      // Mostrar el error que viene del backend (ej: "OTP incorrecto")
      setError(err.message || "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  // Función para volver atrás si se equivocó de usuario
  const handleBack = () => {
    setStep(1);
    setOtp("");
    setError("");
  };

  return (
    <form className="login-form-container" onSubmit={handleSubmit}>
      <h2>{step === 1 ? "Iniciar Sesión" : "Verificación de Seguridad"}</h2>
      
      <p>
        {step === 1 
          ? "Ingresa tus credenciales para acceder" 
          : `Hemos enviado un código OTP a la consola (Simulación) para ${usuario}`}
      </p>

      {/* --- CAMPOS DEL PASO 1 (Usuario y Password) --- */}
      {step === 1 && (
        <>
          <div className="login-input-wrapper">
            <i className="login-icon fas fa-user"></i>
            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="login-input-wrapper">
            <i className="login-icon fas fa-lock"></i>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </>
      )}

      {/* --- CAMPOS DEL PASO 2 (OTP) --- */}
      {step === 2 && (
        <div className="login-input-wrapper">
          <i className="login-icon fas fa-key"></i>
          <input
            type="text"
            placeholder="Código de 6 dígitos"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength="6"
            autoFocus
            autoComplete="one-time-code"
          />
        </div>
      )}

      {error && <p className="login-form-error" style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Procesando..." : (step === 1 ? "Continuar" : "Verificar y Entrar")}
      </button>

      {/* Botón para volver atrás en el paso 2 */}
      {step === 2 && (
        <button type="button" onClick={handleBack} style={{ marginTop: '10px', background: '#ccc' }}>
          Volver
        </button>
      )}

      {step === 1 && (
        <a href="#" onClick={handleRecuperarContrasena} className="login-form-link">
          ¿Olvidaste tu contraseña?
        </a>
      )}
    </form>
  );
};

export default Login;