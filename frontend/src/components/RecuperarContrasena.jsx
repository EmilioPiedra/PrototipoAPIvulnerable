import React, { useState } from "react";
import { requestOtp, verifyOtp, changePassword } from "../services/api";

export default function RecuperarContrasena() {
  const [usuario, setUsuario] = useState("");
  const [otp, setOtp] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [paso, setPaso] = useState(1);
  const [tipoMensaje, setTipoMensaje] = useState(""); // success o error

  const manejarSolicitudOtp = async () => {
    try {
      const res = await requestOtp(usuario);
      setMensaje(res.mensaje || "OTP enviado");
      setTipoMensaje("success");
      setPaso(2);
    } catch (e) {
      setMensaje("Error al solicitar OTP");
      setTipoMensaje("error");
    }
  };

  const manejarValidarOtp = async () => {
    try {
      const res = await verifyOtp({ usuario, otp });
      if (res.valido) {
        setMensaje("OTP validado. Ingresa tu nueva contraseña.");
        setTipoMensaje("success");
        setPaso(3);
      } else {
        setMensaje("OTP inválido");
        setTipoMensaje("error");
      }
    } catch (e) {
      setMensaje("Error al validar OTP");
      setTipoMensaje("error");
    }
  };

  const manejarCambiarPassword = async () => {
    try {
      const res = await changePassword({ usuario, otp, nuevaPassword });
      if (res.valido || res.mensaje?.includes("éxito")) {
        setMensaje("Contraseña cambiada con éxito");
        setTipoMensaje("success");
        setPaso(1);
        setUsuario("");
        setOtp("");
        setNuevaPassword("");
      } else {
        setMensaje("Error al cambiar contraseña");
        setTipoMensaje("error");
      }
    } catch (e) {
      setMensaje("Error al cambiar contraseña");
      setTipoMensaje("error");
    }
  };

  return (
    <div className="recuperar-container">
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
            placeholder="Código OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={manejarValidarOtp} disabled={!otp}>
            Validar OTP
          </button>
          <button onClick={manejarSolicitudOtp}>Reenviar OTP</button>
        </>
      )}

      {paso === 3 && (
        <>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
          />
          <button onClick={manejarCambiarPassword} disabled={!nuevaPassword}>
            Cambiar contraseña
          </button>
        </>
      )}

      {mensaje && (
        <p className={`recuperar-mensaje ${tipoMensaje}`}>{mensaje}</p>
      )}
    </div>
  );
}
