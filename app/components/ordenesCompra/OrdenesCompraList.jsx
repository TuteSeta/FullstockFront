"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Check, X, Trash2 } from "lucide-react";

export default function OrdenesCompraList({ ordenes, onSuccess }) {
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [newCantidad, setNewCantidad] = useState("");
  const [mostrarCanceladas, setMostrarCanceladas] = useState(false);

  // Efecto para mantener sincronizada la orden seleccionada
  useEffect(() => {
    if (ordenSeleccionada) {
      const ordenActualizada = ordenes.find(
        o => o.nroOrdenCompra === ordenSeleccionada.nroOrdenCompra
      );
      if (ordenActualizada) setOrdenSeleccionada(ordenActualizada);
      else setOrdenSeleccionada(null);
    }
    // eslint-disable-next-line
  }, [ordenes]);

  // Cambia el filtro según el estado
  const ordenesFiltradas = mostrarCanceladas
    ? ordenes.filter(o => o.fechaHoraBajaOrdenCompra)
    : ordenes.filter(o => !o.fechaHoraBajaOrdenCompra);

  if (!ordenes.length) {
    return <p className="text-black">No hay órdenes registradas.</p>;
  }

  // Eliminar orden completa
  const handleEliminarOrden = async (nroOrdenCompra) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta orden?");
    if (!confirmar) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenes/${nroOrdenCompra}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setOrdenSeleccionada(null);
      onSuccess?.();
    } else {
      alert("Error al eliminar la orden.");
    }
  };

  // Editar cantidad de un artículo en la orden
  const handleEditarArticulo = async (nroRenglonDOC, nuevaCantidad) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenes-detalle/${nroRenglonDOC}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nuevaCantidad }),
    });

    if (res.ok) {
      // Actualiza el detalle en el estado local (opcional, puedes recargar todo)
      onSuccess?.();
      setEditandoIndex(null);

    } else {
      alert("Error al actualizar la cantidad.");
    }
  };

  // Eliminar artículo de la orden
  const handleEliminarArticulo = async (nroOrdenCompra, nroRenglonDOC) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenes-detalle/${nroRenglonDOC}`, {
      method: "DELETE",
    });

    if (res.ok) {
      onSuccess?.();
    } else {
      alert("Error al eliminar el artículo de la orden.");
    }
  };

  const startEditing = (index, cantidad) => {
    setEditandoIndex(index);
    setNewCantidad(cantidad);
  };

  const saveEditing = (detalle) => {
    handleEditarArticulo(detalle.nroRenglonDOC, Number(newCantidad));
  };


  return (
    <>
      <button
        className="mb-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        onClick={() => setMostrarCanceladas(m => !m)}
      >
        {mostrarCanceladas ? "Ver órdenes activas" : "Ver órdenes canceladas"}
      </button>

      <div className="grid gap-4">
        {ordenesFiltradas.map((orden) => (
          <div
            key={orden.nroOrdenCompra}
            className="border border-gray-200 rounded p-4 shadow-sm bg-white cursor-pointer hover:scale-[1.01] transition-transform"
            onClick={() => setOrdenSeleccionada(orden)}
          >
            <h3 className="font-semibold text-black">
              Orden #{orden.nroOrdenCompra} - Fecha: {new Date(orden.fechaCreacion).toLocaleDateString()} - Monto: (${orden.montoOrdenCompra})
            </h3>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {ordenSeleccionada && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOrdenSeleccionada(null)}
            />

            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative"
              >
                <button
                  onClick={() => setOrdenSeleccionada(null)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                  title="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl text-black font-bold mb-2">
                  Orden #{ordenSeleccionada.nroOrdenCompra}
                </h2>
                <p className="mb-2 text-black">
                  Fecha: {new Date(ordenSeleccionada.fechaCreacion).toLocaleDateString()}
                </p>
                <p className="mb-4 text-black">
                  Monto total: <span className="font-semibold">${ordenSeleccionada.montoOrdenCompra}</span>
                </p>

                <h3 className="font-semibold mb-2 text-black">Artículos Solicitados:</h3>
                <ul className="text-sm text-black space-y-4">
                  {ordenSeleccionada.detalleOrdenCompra.map((detalle, index) => (
                    <li
                      key={detalle.nroRenglonDOC}
                      className="flex justify-between items-start border-b pb-2"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{detalle.nombreArt || detalle.codArticulo}</p>
                        <div className="mt-1 space-y-1 text-sm">
                          <div><strong>Código:</strong> {detalle.codArticulo}</div>
                          <div>
                            <strong>Cantidad:</strong>{" "}
                            {editandoIndex === index ? (
                              <input
                                type="number"
                                value={newCantidad}
                                onChange={(e) => setNewCantidad(e.target.value)}
                                className="border rounded px-1 ml-2 py-1"
                              />
                            ) : (
                              detalle.cantidadDOC
                            )}
                          </div>
                          <div><strong>Monto:</strong> ${detalle.montoDOC}</div>
                        </div>
                      </div>

                      {editandoIndex === index ? (
                        <>
                          <button onClick={() => saveEditing(detalle)} className="text-green-600 hover:text-green-800 ml-2">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditandoIndex(null)} className="text-gray-600 hover:text-gray-800 ml-2">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button onClick={() => startEditing(index, detalle.cantidadDOC)} className="text-blue-600 hover:text-blue-800 ml-2">
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleEliminarArticulo(ordenSeleccionada.nroOrdenCompra, detalle.nroRenglonDOC)}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleEliminarOrden(ordenSeleccionada.nroOrdenCompra)}
                  className="mt-6 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar orden
                </button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}