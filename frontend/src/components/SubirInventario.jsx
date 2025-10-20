// src/components/SubirInventario.jsx
import React, { useState } from "react";
import { addInventario } from "../services/api";


const SubirInventario = ({ token, onProductoAgregado }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "",
    cantidad: 0,
    estado: "",
    descripcion: "",
    ubicacion: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cantidad" ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addInventario(token, formData);
      alert("Producto agregado exitosamente");
      setFormData({
        nombre: "",
        categoria: "",
        cantidad: 0,
        estado: "",
        descripcion: "",
        ubicacion: ""
      });
      if (onProductoAgregado) onProductoAgregado();
    } catch (error) {
      console.error("Error al subir inventario:", error.message);
      alert("Error al agregar producto");
    }
  };

  return (
    <form className="form-inventario" onSubmit={handleSubmit}>
      <h2 className="form-titulo">Agregar producto al inventario</h2>
      <input className="form-input" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
      <input className="form-input" name="categoria" placeholder="Categoría" value={formData.categoria} onChange={handleChange} required />
      <input className="form-input" name="cantidad" type="number" placeholder="Cantidad" value={formData.cantidad} onChange={handleChange} required />
      <input className="form-input" name="estado" placeholder="Estado" value={formData.estado} onChange={handleChange} required />
      <input className="form-input" name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} />
      <input className="form-input" name="ubicacion" placeholder="Ubicación" value={formData.ubicacion} onChange={handleChange} />
      <button className="form-boton" type="submit">Agregar al Inventario</button>
    </form>
  );
};

export default SubirInventario;
