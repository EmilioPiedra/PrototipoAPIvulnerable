import React, { useEffect, useState } from "react";
import { getInventario } from "../services/api";

const Inventario = ({ token }) => {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInventario = async () => {
      try {
        const inventarioData = await getInventario(token);
        setInventory(inventarioData);
      } catch (err) {
        setError("Error al cargar el inventario");
      }
    };

    if (token) loadInventario();
  }, [token]);

  const filteredInventory = inventory.filter((item) =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInventory = filteredInventory.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (error) return <p className="inventario-error">{error}</p>;

  return (
    <div className="inventario-wrapper">
      <div className="inventario-header">
        <div>
          Show{" "}
          <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
            {[5, 10, 15, 20].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>{" "}
          entries
        </div>
        <div>
          Search:{" "}
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="inventario-search"
            placeholder="Buscar por nombre"
          />
        </div>
      </div>

      <table className="inventario-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Cantidad</th>
            <th>Descripción</th>
            <th>Ubicación</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {paginatedInventory.length > 0 ? (
            paginatedInventory.map((item) => (
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>{item.nombre}</td>
                <td>{item.categoria}</td>
                <td>{item.cantidad}</td>
                <td>{item.descripcion}</td>
                <td>{item.ubicacion}</td>
                <td>{item.estado}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No se encontraron resultados</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="inventario-footer">
        <p>
          Mostrando {startIndex + 1} a{" "}
          {startIndex + paginatedInventory.length} de {filteredInventory.length} entradas
        </p>
        <div className="inventario-pagination">
          <button onClick={handlePrevious} disabled={currentPage === 1}>
            Previous
          </button>
          <span className="page-info">
            Página {currentPage} de {totalPages}
          </span>
          <button onClick={handleNext} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inventario;