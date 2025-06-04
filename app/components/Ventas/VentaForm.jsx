"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";

export default function VentaForm({ articulos, onSuccess }) {
  const [articulosVenta, setArticulosVenta] = useState([]);
  const [codArticulo, setCodArticulo] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [errores, setErrores] = useState({});
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [cantidadEditada, setCantidadEditada] = useState("");

  const agregarArticulo = () => {
    const cantidadInt = parseInt(cantidad);
    if (!codArticulo || !cantidad || cantidadInt <= 0) {
      alert("Seleccione un artículo y una cantidad válida.");
      return;
    }

    const articulo = articulos.find((a) => a.codArticulo === parseInt(codArticulo));
    if (!articulo) {
      alert("Artículo no encontrado.");
      return;
    }

    if (cantidadInt > articulo.cantArticulo) {
      alert("La cantidad supera el stock disponible.");
      return;
    }

    setArticulosVenta((prev) => [
      ...prev,
      {
        codArticulo: articulo.codArticulo,
        nombreArt: articulo.nombreArt,
        cantidad: cantidadInt,
        stock: articulo.cantArticulo,
      },
    ]);

    setCodArticulo("");
    setCantidad("");
  };

  const eliminarArticulo = (cod) => {
    setArticulosVenta((prev) => prev.filter((a) => a.codArticulo !== cod));
  };

  const iniciarEdicion = (index, cantidadActual) => {
    setEditandoIndex(index);
    setCantidadEditada(cantidadActual);
  };

  const cancelarEdicion = () => {
    setEditandoIndex(null);
    setCantidadEditada("");
  };

  const guardarEdicion = (index) => {
    const nuevaCantidad = parseInt(cantidadEditada);
    if (nuevaCantidad <= 0 || nuevaCantidad > articulosVenta[index].stock) {
      setErrores((prev) => ({
        ...prev,
        [index]: "Cantidad inválida o superior al stock",
      }));
      return;
    }

    setArticulosVenta((prev) => {
      const copia = [...prev];
      copia[index].cantidad = nuevaCantidad;
      return copia;
    });

    setErrores((prev) => {
      const nuevo = { ...prev };
      delete nuevo[index];
      return nuevo;
    });

    cancelarEdicion();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(errores).length > 0) {
      alert("Corrige los errores antes de registrar la venta.");
      return;
    }

    if (articulosVenta.length === 0) {
      alert("Agrega al menos un artículo a la venta.");
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ventas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        articulos: articulosVenta.map((a) => ({
          codArticulo: a.codArticulo,
          cantidad: a.cantidad,
        })),
      }),
    });

    if (res.ok) {
      setArticulosVenta([]);
      setErrores({});
      onSuccess?.();
    } else {
      const error = await res.json();
      alert(error.error || "Error al registrar la venta");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-12 gap-2">
        <select
          value={codArticulo}
          onChange={(e) => setCodArticulo(e.target.value)}
          className="col-span-6 border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccione un artículo</option>
          {articulos
            .filter(
              (a) => a.cantArticulo >= 1 && !articulosVenta.some((av) => av.codArticulo === a.codArticulo)
            )
            .map((a) => (
              <option key={a.codArticulo} value={a.codArticulo}>
                {a.nombreArt} (Stock: {a.cantArticulo})
              </option>
            ))}
        </select>

        <input
          type="number"
          min="1"
          max={
            articulos.find((a) => a.codArticulo === parseInt(codArticulo))?.cantArticulo || ""
          }
          className="col-span-3 border border-gray-300 rounded px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />

        <button
          type="button"
          onClick={agregarArticulo}
          className="col-span-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center gap-1"
        >
          <Plus className="w-4 h-4" /> Añadir
        </button>
      </div>

      <ul className="space-y-2">
        {articulosVenta.map((a, index) => (
          <li
            key={a.codArticulo}
            className="flex justify-between items-center border rounded px-4 py-2 bg-gray-50"
          >
            <div className="flex-1">
              <span className="text-gray-800 font-medium">{a.nombreArt} - Cantidad:</span>
              {editandoIndex === index ? (
                <>
                  <input
                    type="number"
                    min="1"
                    max={a.stock}
                    value={cantidadEditada}
                    onChange={(e) => setCantidadEditada(e.target.value)}
                    className={`ml-2 w-20 border rounded px-2 py-1 text-gray-800 ${errores[index] ? "border-red-500" : "border-gray-300"}`}
                  />
                  <button
                    type="button"
                    onClick={() => guardarEdicion(index)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={cancelarEdicion}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {errores[index] && (
                    <p className="text-red-500 text-xs mt-1">{errores[index]}</p>
                  )}
                </>
              ) : (
                <>
                  <span className="ml-2 text-gray-800">{a.cantidad}</span>
                  <button
                    type="button"
                    onClick={() => iniciarEdicion(index, a.cantidad)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => eliminarArticulo(a.codArticulo)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold w-full"
      >
        Registrar Venta
      </button>
    </form>
  );
}
