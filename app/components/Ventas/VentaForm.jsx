"use client";
import { li } from "framer-motion/client";
import { useState } from "react";

export default function VentaForm({ articulos, onSuccess }) {
  const [articulosVenta, setArticulosVenta] = useState([]);
  const [codArticulo, setCodArticulo] = useState("");
  const [cantidad, setCantidad] = useState("");

  // Agregar articulo 
  const agregarArticulo = () => {
  if (!codArticulo) {
    alert("Seleccione un artículo.");
    return;
  }

  if (!cantidad || parseInt(cantidad) <= 0) {
    alert("Ingrese una cantidad válida mayor a cero.");
    return;
  }

  const articulo = articulos.find(a => a.codArticulo === parseInt(codArticulo));
  if (!articulo) {
    alert("Artículo no encontrado.");
    return;
  }

  setArticulosVenta(prev => [
    ...prev,
    {
      codArticulo: articulo.codArticulo,
      nombreArt: articulo.nombreArt,
      cantidad: parseInt(cantidad),
      stock: articulo.cantArticulo,
    }
  ]);

  setCodArticulo("");
  setCantidad("");
};

  //Eliminar articulo de la venta
  const eliminarArticulo = (codArticulo) => {
    setArticulosVenta(prev => prev.filter(a => a.codArticulo !== codArticulo));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (articulosVenta.length === 0) {
      alert("Agrega al menos un articulo a la venta.")
      return;
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ventas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        articulos: articulosVenta.map(a => ({
          codArticulo: a.codArticulo,
          cantidad: a.cantidad,
        })),
      }),
    });

    if (res.ok) {
      setArticulosVenta([]);
      onSuccess?.();
    } else {
      const error = await res.json();
      alert(error.error || "Error al registrar la venta");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 space-y-4 text-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <select
        value={codArticulo}
        onChange={(e) => setCodArticulo(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 col-span-full bg-white text-gray-800"
      >
        <option value="">Seleccione un artículo</option>
        {articulos
          .filter((a) => a.cantArticulo >= 1 && !articulosVenta.some(av => av.codArticulo === a.codArticulo))
          .map((a) => (
            <option key={a.codArticulo} value={a.codArticulo}>
              {a.nombreArt} (Stock: {a.cantArticulo})
            </option>
          ))}
      </select>

      <input
        type="number"
        min="1"
        max={articulos.find((a) => a.codArticulo === parseInt(codArticulo))?.cantArticulo || ""}
        className="border border-gray-300 rounded px-3 py-2 col-span-full text-gray-800 bg-white"
        placeholder="Cantidad"
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
      />

      <button type="button" onClick={agregarArticulo} className="bg-blue-600 text-white px-3 py-1 rounded">
        Añadir
      </button>

      {/*Lista de articulos agregados */}
      <ul className="text-sm text-gray-700 space-y-2">
        {articulosVenta.map(a => (
          <li key={a.codArticulo} className="flex justify-between items-center border-b pb-1">
            <span>
              {a.nombreArt} - Cantidad: {a.cantidad}
            </span>
            <button type="button" onClick={() => eliminarArticulo(a.codArticulo)} className="text-red-600 hover:text-red-800 ml-2">
              Eliminar
            </button>
          </li>
        ))}

      </ul>


      <button
        type="submit"
        className="col-span-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Registrar Venta
      </button>
    </form>
  );
}
