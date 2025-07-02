// src/components/Facturar.jsx
import React, { useState } from "react";

const Facturar = () => {
  const [cedula, setCedula] = useState("");
  const [respuesta, setRespuesta] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRespuesta(null);
    setError("");

    try {
      // Simulación de llamada al servicio SOAP/XML (puedes cambiar esta parte con tu función real)
      const result = await fetch("/api/verificar-antecedentes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cedula }),
      });

      const data = await result.json();
      if (result.ok) {
        setRespuesta(data.estado);
      } else {
        setError(data.error || "Error al consultar antecedentes");
      }
    } catch (err) {
      setError("No se pudo conectar con el servicio");
    }
  };

  return (
    <div>
      <h2>Facturar</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Cédula del cliente:
          <input
            type="text"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            required
          />
        </label>
        <button type="submit">Validar antecedentes</button>
      </form>

      {respuesta && <p>Resultado: {respuesta}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Facturar;
