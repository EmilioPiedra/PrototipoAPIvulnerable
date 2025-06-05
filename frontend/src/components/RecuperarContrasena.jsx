import React, { useState } from "react";
import { requestOtp, verifyOtp, changePassword } from "../services/api"; // Asegúrate de importar los tres

export default function RecuperarContrasena() {
  const [usuario, setUsuario] = useState("");
  const [otp, setOtp] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [paso, setPaso] = useState(1); // 1 = solicitar OTP, 2 = validar OTP, 3 = cambiar contraseña

  // Solicitar OTP
  const manejarSolicitudOtp = async () => {
    try {
      const res = await requestOtp(usuario);
      setMensaje(res.mensaje || "OTP enviado");
      setPaso(2);
    } catch (e) {
      setMensaje("Error al solicitar OTP");
    }
  };

  // Validar OTP
  const manejarValidarOtp = async () => {
    try {
      const res = await verifyOtp({ usuario, otp });
      if (res.valido) {
        setMensaje("OTP validado, ahora ingresa tu nueva contraseña");
        setPaso(3);
      } else {
        setMensaje("OTP inválido");
      }
    } catch (e) {
      setMensaje("Error al validar OTP");
    }
  };

  // Cambiar contraseña
  const manejarCambiarPassword = async () => {
    try {
      const res = await changePassword({ usuario, otp, nuevaPassword }); // ✅ ahora se usa changePassword
      if (res.valido || res.mensaje?.includes("éxito")) {
        setMensaje("Contraseña cambiada con éxito");
        setPaso(1);
        setUsuario("");
        setOtp("");
        setNuevaPassword("");
      } else {
        setMensaje("Error al cambiar contraseña");
      }
    } catch (e) {
      setMensaje("Error al cambiar contraseña");
    }
  };

  return (
    <div className="container">
      <h2>Recuperar contraseña</h2>

      {paso === 1 && (
        <>
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          <button onClick={manejarSolicitudOtp} disabled={!usuario}>
            Solicitar OTP
          </button>
        </>
      )}

      {paso === 2 && (
        <>
          <input
            type="text"
            placeholder="OTP recibido"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={manejarValidarOtp} disabled={!otp}>
            Validar OTP
          </button>
          <button onClick={manejarSolicitudOtp} disabled={!usuario}>
            Volver a solicitar OTP
          </button>
        </>
      )}

      {paso === 3 && (
        <>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            style={{ marginRight: 10 }}
          />
          <button onClick={manejarCambiarPassword} disabled={!nuevaPassword}>
            Cambiar contraseña
          </button>
        </>
      )}

      <p>{mensaje}</p>
    </div>
  );
}
