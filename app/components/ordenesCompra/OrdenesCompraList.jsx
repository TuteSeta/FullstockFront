"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Check, X, Trash2 } from "lucide-react";

export default function OrdenesCompraList({ ordenes, onSuccess }) {
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [newCantidad, setNewCantidad] = useState("");
  const [mostrarCanceladas, setMostrarCanceladas] = useState(false);

  // Enviar una orden

  const handleEnviarOrden = async (nroOrdenCompra) => {
    const confirmar = window.confirm("¿Enviar esta orden? No podrá ser modificada ni cancelada.");
    if (!confirmar) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenes/${nroOrdenCompra}/enviar`, {
      method: "PATCH",
    });

    if (res.ok) {
      onSuccess?.();
      setOrdenSeleccionada(null);
    } else {
      const error = await res.json();
      alert(error.error || "Error al enviar la orden.");
    }
  };

  // Finalizar una orden
  const handleFinalizarOrden = async (nroOrdenCompra) => {
    const confirmar = window.confirm("¿Marcar esta orden como finalizada y actualizar stock?");
    if (!confirmar) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenes/${nroOrdenCompra}/finalizar`, {
      method: "PATCH",
    });

    if (res.ok) {
      onSuccess?.();
      setOrdenSeleccionada(null);
    } else {
      const error = await res.json();
      alert(error.error || "Error al finalizar la orden.");
    }
  };


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
      <div className="hidden sm:grid grid-cols-4 gap-4 px-4 py-2 bg-gray-100 rounded text-sm font-semibold text-gray-700">
        <div>Código</div>
        <div>Fecha</div>
        <div>Monto</div>
        <div>Estado</div>
      </div>
      <div className="grid gap-4">
        {ordenesFiltradas.map((orden) => (
          <div
            key={orden.nroOrdenCompra}
            className="grid grid-cols-4 gap-4 items-center px-4 py-2 bg-white border rounded shadow-sm cursor-pointer hover:scale-[1.01] transition-transform"
            onClick={() => setOrdenSeleccionada(orden)}
          >
            <div className="font-medium text-gray-800">#{orden.nroOrdenCompra}</div>
            <div className="text-sm text-gray-700">{new Date(orden.fechaCreacion).toLocaleDateString()}</div>
            <div className="text-sm text-gray-700">${orden.montoOrdenCompra}</div>
            <div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${orden.estadoOrdenCompra?.nombreEstadoOC === 'Pendiente'
                  ? 'bg-yellow-100 text-yellow-800'
                  : orden.estadoOrdenCompra?.nombreEstadoOC === 'Enviada'
                    ? 'bg-blue-100 text-blue-800'
                    : orden.estadoOrdenCompra?.nombreEstadoOC === 'Finalizada'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-200 text-gray-700'
                }`}>
                {orden.estadoOrdenCompra?.nombreEstadoOC ?? 'Desconocido'}
              </span>
            </div>
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
                <p className="mb-2 text-black">
                  Estado actual:{" "}
                  <span className="font-semibold">
                    {ordenSeleccionada.estadoOrdenCompra?.nombreEstadoOC || "Desconocido"}
                  </span>
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

                      {ordenSeleccionada.estadoOrdenCompra?.nombreEstadoOC === "Pendiente" && (
                        <>
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
                        </>
                      )}
                    </li>
                  ))}
                </ul>

                {ordenSeleccionada.estadoOrdenCompra?.nombreEstadoOC === "Pendiente" && (
                  <button
                    onClick={() => handleEliminarOrden(ordenSeleccionada.nroOrdenCompra)}
                    className="mt-6 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar orden
                  </button>
                )}

                {ordenSeleccionada.estadoOrdenCompra?.nombreEstadoOC === "Pendiente" && (
                  <button
                    onClick={() => handleEnviarOrden(ordenSeleccionada.nroOrdenCompra)}
                    className="mt-2 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    <Check className="w-4 h-4" />
                    Enviar orden
                  </button>
                )}

                {ordenSeleccionada.estadoOrdenCompra?.nombreEstadoOC === "Enviada" && (
                  <button
                    onClick={() => handleFinalizarOrden(ordenSeleccionada.nroOrdenCompra)}
                    className="mt-2 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    <Check className="w-4 h-4" />
                    Finalizar orden
                  </button>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}