import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getInventario,
  createCompra,
  obtenerCompras, // ✅ corregido nombre de la función
  eliminarCompra, // ✅ opcional si luego quieres eliminar
} from "../services/api";

const ComprarProductos = () => {
  const { token } = useContext(AuthContext);
  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState([]);
  const [compras, setCompras] = useState([]);
  const [error, setError] = useState("");

  // ✅ Cargar inventario del usuario autenticado
  useEffect(() => {
    if (!token) return;
    const loadInventario = async () => {
      try {
        const data = await getInventario(token);
        setInventory(data);
      } catch (err) {
        setError("Error al cargar inventario: " + err.message);
      }
    };
    loadInventario();
  }, [token]);

  // ✅ Cargar historial de compras (filtradas por UUID)
  useEffect(() => {
    if (!token) return;
    const loadCompras = async () => {
      try {
        const data = await obtenerCompras(token);
        setCompras(data);
      } catch (err) {
        console.error("Error al obtener compras:", err.message);
        setCompras([]);
      }
    };
    loadCompras();
  }, [token]);

  // ✅ Agregar productos al carrito
  const addToCart = (item) => {
    const exists = cart.find((p) => p._id === item._id);
    if (exists) {
      setCart(
        cart.map((p) =>
          p._id === item._id ? { ...p, cantidad: p.cantidad + 1 } : p
        )
      );
    } else {
      setCart([...cart, { ...item, cantidad: 1 }]);
    }
  };

  // ✅ Calcular total de compra
  const total = cart.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  // ✅ Confirmar compra (insegura)
  const handleCompra = async () => {
    try {
      if (cart.length === 0) return alert("El carrito está vacío.");

      const payload = {
        productos: cart.map((p) => ({
          productoId: p._id,
          nombre: p.nombre,
          precio: p.precio,
          cantidad: p.cantidad,
        })),
        total,
      };

      const result = await createCompra(token, payload);
      console.log("Compra registrada:", result);

      alert("✅ Compra registrada correctamente (inseguro).");
      setCart([]);
      // Actualizar historial con la nueva compra
      setCompras((prev) => [result.compra, ...prev]);
    } catch (err) {
      alert("Error al crear la compra: " + err.message);
    }
  };

  // ✅ Eliminar compra (opcional, si tienes el endpoint)
  const handleEliminarCompra = async (id) => {
    try {
      await eliminarCompra(id, token);
      setCompras((prev) => prev.filter((c) => c._id !== id));
      alert("Compra eliminada correctamente");
    } catch (err) {
      alert("Error al eliminar compra: " + err.message);
    }
  };

  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <h2>🛍️ Comprar Productos</h2>

      {/* INVENTARIO */}
      <div className="row">
        {inventory.map((item) => (
          <div key={item._id} className="col-md-4 mb-3">
            <div className="card p-3 shadow-sm">
              <h5>{item.nombre}</h5>
              <p>Precio: ${item.precio}</p>
              <button
                className="btn btn-sm btn-success"
                onClick={() => addToCart(item)}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CARRITO */}
      {cart.length > 0 && (
        <div className="mt-4">
          <h4>🛒 Carrito</h4>
          <ul className="list-group">
            {cart.map((p) => (
              <li key={p._id} className="list-group-item">
                {p.nombre} x {p.cantidad} — ${p.precio * p.cantidad}
              </li>
            ))}
          </ul>
          <h5 className="mt-3">Total: ${total.toFixed(2)}</h5>
          <button className="btn btn-primary mt-2" onClick={handleCompra}>
            Confirmar compra
          </button>
        </div>
      )}

      <hr />
      <h2>📜 Historial de Compras</h2>

      {/* HISTORIAL */}
      {compras.length === 0 ? (
        <p>No hay compras registradas.</p>
      ) : (
        <ul className="list-group">
          {compras.map((c) => (
            <li
              key={c._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{c.usuario}</strong> — ${c.total} —{" "}
                {new Date(c.fecha).toLocaleString()}
                <ul>
                  {c.productos.map((p, idx) => (
                    <li key={idx}>
                      {p.nombre} x {p.cantidad} — ${p.precio * p.cantidad}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleEliminarCompra(c._id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ComprarProductos;
