import React, { useState } from "react";
import {
  verificarAntecedentes,
  getInventario,
  facturarCliente
} from "../services/api";


const Facturar = () => {
  const [fechaEmision, setFechaEmision] = useState(new Date().toISOString().split("T")[0]);
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [cedula, setCedula] = useState("");
  const [estado, setEstado] = useState(null);
  const [inventario, setInventario] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [descuento, setDescuento] = useState(0);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleVerificar = async (e) => {
    e.preventDefault();
    setError("");
    setEstado(null);
    setInventario([]);
    setProductosSeleccionados([]);

    try {
      const data = await verificarAntecedentes(cedula, token);
      setEstado(data.estado);
      if (data.estado?.toLowerCase() === "sin antecedentes") {
        const productos = await getInventario(token);
        setInventario(productos);
      }
    } catch (err) {
      setError("Error al verificar antecedentes: " + err.message);
    }
  };

  const handleAgregar = (producto) => {
    setProductosSeleccionados((prev) => {
      const existe = prev.find((p) => p._id === producto._id);
      if (existe) {
        if (existe.cantidad < producto.cantidad) {
          return prev.map((p) =>
            p._id === producto._id ? { ...p, cantidad: p.cantidad + 1 } : p
          );
        } else {
          alert("No hay más stock disponible.");
          return prev;
        }
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const handleFacturar = async () => {
    try {
      const factura = {
        cedula,
        productos: productosSeleccionados.map(({ _id, cantidad }) => ({
          id: _id,
          cantidad
        }))
      };
      await facturarCliente(factura, token);
      alert("Factura generada con éxito.");
      // Resetear
      setCedula("");
      setEstado(null);
      setInventario([]);
      setProductosSeleccionados([]);
      setDescuento(0);
    } catch (err) {
      alert("Error al facturar: " + err.message);
    }
  };

  const calcularTotal = () =>
    productosSeleccionados.reduce((sum, p) => sum + (p.cantidad * 1), 0);

  const totalConDescuento = () => {
    const total = calcularTotal();
    return total - (descuento > 1 ? descuento : total * descuento);
  };

  return (
    <div className="factura-container">
      <h2 className="factura-titulo">Nueva Factura</h2>

      <form onSubmit={handleVerificar}>
        <div className="factura-seccion">
          <h3 className="factura-subtitulo">Fechas</h3>
          <div className="factura-fechas">
            <div className="factura-campo">
              <label>Fecha de Emisión:</label>
              <input type="date" value={fechaEmision} onChange={(e) => setFechaEmision(e.target.value)} />
            </div>
            <div className="factura-campo">
              <label>Fecha de Vencimiento:</label>
              <input type="date" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="factura-seccion">
          <h3 className="factura-subtitulo">Cliente</h3>
          <div className="factura-cliente">
            <input
              type="text"
              placeholder="Cédula del cliente"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              required
            />
            <button className="factura-btn" type="submit">Verificar antecedentes</button>
          </div>
        </div>
      </form>

      {estado && (
        <p style={{ color: estado.toLowerCase() === "sin antecedentes" ? "green" : "red" }}>
          Estado: {estado}
        </p>
      )}

      {estado?.toLowerCase() === "sin antecedentes" && (
        <>
          <div className="factura-seccion">
            <h3 className="factura-subtitulo">Productos</h3>
          <div className="factura-productos-grid">
            {inventario.map((item) => (
              <div className="factura-producto-card" key={item._id}>
                <h4>{item.nombre}</h4>
                <p>{item.cantidad} disponibles</p>
                <button className="factura-btn" onClick={() => handleAgregar(item)}>
                  Agregar a la factura
                </button>
              </div>
            ))}
          </div>
          </div>

          <div className="factura-seccion">
            <h3 className="factura-subtitulo">Descuento</h3>
            <input
              type="number"
              value={descuento}
              onChange={(e) => setDescuento(parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>

          <div className="factura-seccion">
            <h3 className="factura-subtitulo">Resumen</h3>
            <table className="factura-tabla">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {productosSeleccionados.map((p) => (
                  <tr key={p._id}>
                    <td>{p.nombre}</td>
                    <td>{p.cantidad}</td>
                    <td>${p.cantidad * 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="factura-seccion-totales">
              <p>Total: ${calcularTotal()}</p>
              <p>Descuento: ${descuento}</p>
              <h3>Total a pagar: ${totalConDescuento()}</h3>
              <button className="factura-btn-generar" onClick={handleFacturar}>Generar Factura</button>
            </div>
          </div>
        </>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Facturar;
