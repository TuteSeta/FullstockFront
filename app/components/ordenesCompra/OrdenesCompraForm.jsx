"use client";

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function OrdenesCompraForm({ proveedores, articulos, onSuccess }) {
  const [codProveedor, setCodProveedor] = useState("");
  const [detalleOC, setDetalleOC] = useState([]);
  const [codArticulo, setCodArticulo] = useState("");
  const [cantidadDOC, setCantidadDOC] = useState("");
  const [articulosProveedor, setArticulosProveedor] = useState([]);
  const [precioActual, setPrecioActual] = useState(null);
  const [cantidadError, setCantidadError] = useState(""); // Nuevo estado para el error

  // Cargar artículos del proveedor seleccionado
  useEffect(() => {
    if (codProveedor) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor-articulos/proveedor/${codProveedor}`)
        .then(res => res.json())
        .then(data => setArticulosProveedor(data.map(r => ({
          codArticulo: r.articulo.codArticulo,
          nombreArt: r.articulo.nombreArt,
          precioUnitarioAP: r.precioUnitarioAP ?? r.costoUnitarioAP ?? 0
        }))));
    } else {
      setArticulosProveedor([]);
    }
    setCodArticulo("");
    setPrecioActual(null);
  }, [codProveedor]);

  // Actualizar precio cuando cambia el artículo
  useEffect(() => {
    if (codArticulo) {
      const art = articulosProveedor.find(a => a.codArticulo === parseInt(codArticulo));
      setPrecioActual(art ? art.precioUnitarioAP : null);
    } else {
      setPrecioActual(null);
    }
  }, [codArticulo, articulosProveedor]);

  // Agregar artículo a la orden
  const agregarArticulo = () => {
    if (!codArticulo || !cantidadDOC) return;
    if (Number(cantidadDOC) < 1) {
      setCantidadError("La cantidad debe ser mayor o igual a 1");
      return;
    }
    setCantidadError(""); // Limpia el error si está todo bien
    const articulo = articulos.find(a => a.codArticulo === parseInt(codArticulo));
    const articuloProveedor = articulosProveedor.find(a => a.codArticulo === parseInt(codArticulo));
    if (!articulo || !articuloProveedor || typeof articuloProveedor.precioUnitarioAP !== "number") {
      alert("Error: no se pudo obtener el precio del artículo.");
      return;
    }
    setDetalleOC(prev => [
      ...prev,
      {
        codArticulo: articulo.codArticulo,
        nombreArt: articulo.nombreArt,
        cantidadDOC: parseInt(cantidadDOC),
        montoDOC: articuloProveedor.precioUnitarioAP * parseInt(cantidadDOC), // solo para mostrar
      }
    ]);
    setCodArticulo("");
    setCantidadDOC("");
    setPrecioActual(null);
  };

  // Eliminar artículo de la orden
  const eliminarArticulo = (codArticulo) => {
    setDetalleOC(prev => prev.filter(a => a.codArticulo !== codArticulo));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!codProveedor) {
      Swal.fire("Falta proveedor", "Selecciona un proveedor.", "warning");
      return;
    }

    if (detalleOC.length === 0) {
      Swal.fire("Sin artículos", "Agrega al menos un artículo a la orden.", "warning");
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codProveedor: parseInt(codProveedor),
        detalleOC: detalleOC.map((a) => ({
          codArticulo: a.codArticulo,
          cantidadDOC: a.cantidadDOC,
        })),
      }),
    });

    if (res.ok) {
      setCodProveedor("");
      setDetalleOC([]);
      onSuccess?.();
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Orden de compra registrada correctamente.",
        confirmButtonColor: "#16a34a", // verde Tailwind
      });
    } else {
      const error = await res.json();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.error || "No se pudo registrar la orden.",
        confirmButtonColor: "#dc2626", // rojo Tailwind
      });
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
          {articulosProveedor
            .filter(a => !detalleOC.some(d => d.codArticulo === a.codArticulo))
            .map(a => (
              <option key={a.codArticulo} value={a.codArticulo}>
                {a.nombreArt}
              </option>
            ))}
        </select>

        <div className="flex flex-col">
          <input
            type="number"
            min={1}
            placeholder="Cantidad"
            value={cantidadDOC}
            onChange={e => {
              setCantidadDOC(e.target.value);
              setCantidadError("");
            }}
            className="border border-gray-300 rounded px-3 py-2 w-24 text-gray-800 bg-white"
          />
          
        </div>

        {/* Mostrar el precio unitario y el monto calculado */}
        {precioActual !== null && cantidadDOC ? (
          <div className="flex items-center text-gray-700">
            <span className="ml-2">
              Precio: ${precioActual} | Monto: ${Number(precioActual) * Number(cantidadDOC)}
            </span>
          </div>
        ) : null}

        <button
          type="button"
          onClick={agregarArticulo}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Añadir
        </button>
      </div>

      {/* Mensaje de error debajo de la fila */}
      {cantidadError && (
        <div className="text-red-600 text-xs mt-1">{cantidadError}</div>
      )}
      
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