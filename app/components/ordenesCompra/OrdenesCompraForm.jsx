"use client";

import { useState } from "react";

export default function OrdenesCompraForm({ proveedores, articulos, onSuccess }) {
  const [codProveedor, setCodProveedor] = useState("");
  const [detalleOC, setDetalleOC] = useState([]);
  const [codArticulo, setCodArticulo] = useState("");
  const [cantidadDOC, setCantidadDOC] = useState("");
  const [montoDOC, setMontoDOC] = useState("");

  // Agregar artículo a la orden
  const agregarArticulo = () => {
    if (!codArticulo || !cantidadDOC || !montoDOC) return;
    const articulo = articulos.find(a => a.codArticulo === parseInt(codArticulo));
    if (!articulo) return;
    setDetalleOC(prev => [
      ...prev,
      {
        codArticulo: articulo.codArticulo,
        nombreArt: articulo.nombreArt,
        cantidadDOC: parseInt(cantidadDOC),
        montoDOC: parseFloat(montoDOC),
      }
    ]);
    setCodArticulo("");
    setCantidadDOC("");
    setMontoDOC("");
  };

  // Eliminar artículo de la orden
  const eliminarArticulo = (codArticulo) => {
    setDetalleOC(prev => prev.filter(a => a.codArticulo !== codArticulo));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!codProveedor) {
      alert("Selecciona un proveedor.");
      return;
    }
    if (detalleOC.length === 0) {
      alert("Agrega al menos un artículo a la orden.");
      return;
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codProveedor: parseInt(codProveedor),
        detalleOC: detalleOC.map(a => ({
          codArticulo: a.codArticulo,
          cantidadDOC: a.cantidadDOC,
          montoDOC: a.montoDOC,
        })),
      }),
    });

    if (res.ok) {
      setCodProveedor("");
      setDetalleOC([]);
      onSuccess?.();
    } else {
      const error = await res.json();
      alert(error.error || "Error al registrar la orden de compra");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 space-y-4 text-sm"
      onClick={e => e.stopPropagation()}
    >
      {/* Proveedor */}
      <select
        value={codProveedor}
        onChange={e => setCodProveedor(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 col-span-full bg-white text-gray-800"
        required
      >
        <option value="">Seleccione un proveedor</option>
        {proveedores.map(p => (
          <option key={p.codProveedor} value={p.codProveedor}>
            {p.nombreProveedor}
          </option>
        ))}
      </select>

      {/* Artículo, cantidad y monto */}
      <div className="flex gap-2">
        <select
          value={codArticulo}
          onChange={e => setCodArticulo(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-800"
        >
          <option value="">Seleccione un artículo</option>
          {articulos
            .filter(a => !detalleOC.some(d => d.codArticulo === a.codArticulo))
            .map(a => (
              <option key={a.codArticulo} value={a.codArticulo}>
                {a.nombreArt}
              </option>
            ))}
        </select>
        <input
          type="number"
          min="1"
          placeholder="Cantidad"
          value={cantidadDOC}
          onChange={e => setCantidadDOC(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-24 text-gray-800 bg-white"
        />
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Monto"
          value={montoDOC}
          onChange={e => setMontoDOC(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-24 text-gray-800 bg-white"
        />
        <button
          type="button"
          onClick={agregarArticulo}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Añadir
        </button>
      </div>

      {/* Lista de artículos agregados */}
      <ul className="text-sm text-gray-700 space-y-2">
        {detalleOC.map(a => (
          <li key={a.codArticulo} className="flex justify-between items-center border-b pb-1">
            <span>
              {a.nombreArt} - Cantidad: {a.cantidadDOC} - Monto: ${a.montoDOC}
            </span>
            <button
              type="button"
              onClick={() => eliminarArticulo(a.codArticulo)}
              className="text-red-600 hover:text-red-800 ml-2"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      <button
        type="submit"
        className="col-span-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Registrar Orden de Compra
      </button>
    </form>
  );
}