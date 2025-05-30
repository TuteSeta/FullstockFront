"use client";
import { useState } from "react";

export default function VentaForm({ articulos, onSuccess }) {
  const [codArticulo, setCodArticulo] = useState("");
  const [cantidad, setCantidad] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ventas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codArticulo: parseInt(codArticulo),
        cantidadVendida: parseInt(cantidad),
      }),
    });

    if (res.ok) {
      setCodArticulo("");
      setCantidad("");
      onSuccess?.();
    } else {
      const error = await res.json();
      alert(error.error || "Error al registrar la venta");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <select
        value={codArticulo}
        onChange={(e) => setCodArticulo(e.target.value)}
        required
        className="border border-gray-300 rounded px-3 py-2 col-span-full"
      >
        <option value="">Seleccione un artículo</option>
        {articulos
          .filter((a) => a.cantArticulo >= 1) // Filtrar artículos con stock mayor o igual a 1
          .map((a) => (
            <option key={a.codArticulo} value={a.codArticulo}>
              #{a.codArticulo} - {a.nombreArt} (Stock: {a.cantArticulo})
            </option>
          ))}
      </select>

      <input
        type="number"
        min="1"
        placeholder="Cantidad"
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
        required
        className="border border-gray-300 rounded px-3 py-2 col-span-full"
        max={articulos.find((a) => a.codArticulo === parseInt(codArticulo))?.cantArticulo || ""}
      />

      <button
        type="submit"
        className="col-span-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Registrar Venta
      </button>
    </form>
  );
}