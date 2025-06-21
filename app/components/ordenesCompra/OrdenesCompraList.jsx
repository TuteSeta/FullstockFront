"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Check, X, Trash2 } from "lucide-react";
import Swal from 'sweetalert2';

export default function OrdenesCompraList({ ordenes, onSuccess }) {
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [newCantidad, setNewCantidad] = useState("");
  const [cantidadError, setCantidadError] = useState("");

const handleEnviarOrden = async (nroOrdenCompra) => {
  const result = await Swal.fire({
    title: '¿Enviar esta orden?',
    text: 'No podrá ser modificada ni cancelada.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, enviar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenes/${nroOrdenCompra}/enviar`, {
      method: "PATCH",
    });

    if (res.ok) {
      await Swal.fire({
        icon: 'success',
        title: 'Enviada',
        text: 'La orden fue enviada exitosamente.',
        confirmButtonColor: '#16a34a'
      });
      onSuccess?.();
      setOrdenSeleccionada(null);
    } else {
      const error = await res.json();
      Swal.fire('Error', error.error || "Error al enviar la orden.", 'error');
    }
  }
};

const handleFinalizarOrden = async (nroOrdenCompra) => {
  const result = await Swal.fire({
    title: '¿Finalizar esta orden?',
    text: 'Se actualizará el stock y no podrá revertirse.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#16a34a',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, finalizar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenes/${nroOrdenCompra}/finalizar`, {
      method: "PATCH",
    });

    if (res.ok) {
      await Swal.fire({
        icon: 'success',
        title: 'Finalizada',
        text: 'La orden fue finalizada y el stock actualizado.',
        confirmButtonColor: '#16a34a'
      });
      onSuccess?.();
      setOrdenSeleccionada(null);
    } else {
      const error = await res.json();
      Swal.fire('Error', error.error || "Error al finalizar la orden.", 'error');
    }
    }
  };

  useEffect(() => {
    if (ordenSeleccionada) {
      const ordenActualizada = ordenes.find(
        o => o.nroOrdenCompra === ordenSeleccionada.nroOrdenCompra
      );
      if (ordenActualizada) setOrdenSeleccionada(ordenActualizada);
      else setOrdenSeleccionada(null);
    }
  }, [ordenes]);

const handleEliminarOrden = async (nroOrdenCompra) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará la orden de forma permanente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenes/${nroOrdenCompra}`, {
      method: "DELETE",
    });

    if (res.ok) {
      await Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'La orden fue eliminada exitosamente.',
        confirmButtonColor: '#16a34a'
      });
      setOrdenSeleccionada(null);
      onSuccess?.();
    } else {
      Swal.fire('Error', 'Error al eliminar la orden.', 'error');
    }
    }
  };

  const handleEditarArticulo = async (nroRenglonDOC, nuevaCantidad) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenes-detalle/${nroRenglonDOC}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nuevaCantidad }),
    });

    if (res.ok) {
      onSuccess?.();
      setEditandoIndex(null);
    } else {
      alert("Error al actualizar la cantidad.");
    }
  };

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
    setCantidadError("");
  };

  const saveEditing = (detalle) => {
    if (!newCantidad || Number(newCantidad) < 1) {
      setCantidadError("La cantidad debe ser mayor o igual a 1");
      return;
    }
    setCantidadError("");
    handleEditarArticulo(detalle.nroRenglonDOC, Number(newCantidad));
  };

  if (!ordenes.length) {
    return <p className="text-black">No hay órdenes registradas.</p>;
  }

  return (
    <>
      <div className="hidden sm:grid grid-cols-4 gap-4 px-4 py-2 bg-gray-100 rounded text-sm font-semibold text-gray-700">
        <div>Código</div>
        <div>Fecha</div>
        <div>Monto</div>
        <div>Estado</div>
      </div>

      <div className="grid gap-4">
        {ordenes.map((orden) => (
          <div
            key={orden.nroOrdenCompra}
            className="grid grid-cols-4 gap-4 items-center px-4 py-2 bg-white border rounded shadow-sm cursor-pointer hover:scale-[1.01] transition-transform"
            onClick={() => setOrdenSeleccionada(orden)}
          >
            <div className="font-medium text-black">#{orden.nroOrdenCompra}</div>
            <div className="text-sm text-black">{new Date(orden.fechaCreacion).toLocaleDateString()}</div>
            <div className="text-sm text-black">${orden.montoOrdenCompra}</div>
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
                className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative"
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
                  Estado actual: <span className="font-semibold">{ordenSeleccionada.estadoOrdenCompra?.nombreEstadoOC || "Desconocido"}</span>
                </p>
                <p className="mb-4 text-black">
                  Monto total: <span className="font-semibold">${ordenSeleccionada.montoOrdenCompra}</span>
                </p>

                <h3 className="font-semibold mb-2 text-black">Artículos Solicitados:</h3>

                <div className="grid grid-cols-5 gap-4 bg-gray-200 p-2 rounded text-sm font-semibold text-black mb-2">
                  <div>Código</div>
                  <div>Nombre</div>
                  <div className="text-center">Cantidad</div>
                  <div className="text-center">Monto</div>
                  <div className="text-center">Acciones</div>
                </div>

                <div
                  className="space-y-2 overflow-y-auto pr-1"
                  style={{
                    maxHeight: ordenSeleccionada.detalleOrdenCompra.length > 3 ? "200px" : "none"
                  }}
                >
                  {ordenSeleccionada.detalleOrdenCompra.map((detalle, index) => (
                    <div key={detalle.nroRenglonDOC} className="grid grid-cols-5 gap-4 bg-white p-2 rounded shadow-sm items-center text-sm text-black">
                      <div>{detalle.codArticulo}</div>
                      <div>{detalle.articulo?.nombreArt ?? 'Sin nombre'}</div>
                      <div className="text-center">
                        {editandoIndex === index ? (
                          <div className="flex justify-center items-center gap-1">
                            <input
                              type="number"
                              min={1}
                              value={newCantidad}
                              onChange={(e) => {
                                setNewCantidad(e.target.value);
                                setCantidadError('');
                              }}
                              className="border rounded px-1 py-0.5 w-16 text-center"
                            />
                          </div>
                        ) : (
                          detalle.cantidadDOC
                        )}
                        {editandoIndex === index && cantidadError && (
                          <div className="text-red-600 text-xs mt-1 col-span-5">{cantidadError}</div>
                        )}
                      </div>
                      <div className="text-center">${detalle.montoDOC}</div>
                      <div className="flex justify-center gap-2">
                        {ordenSeleccionada.estadoOrdenCompra?.nombreEstadoOC === "Pendiente" && (
                          <>
                            {editandoIndex === index ? (
                              <>
                                <button onClick={() => saveEditing(detalle)} className="text-green-600 hover:text-green-800">
                                  <Check className="w-4 h-4" />
                                </button>
                                <button onClick={() => setEditandoIndex(null)} className="text-gray-600 hover:text-gray-800">
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <button onClick={() => startEditing(index, detalle.cantidadDOC)} className="text-blue-600 hover:text-blue-800">
                                <Pencil className="w-4 h-4" />
                              </button>
                            )}
                            <button onClick={() => handleEliminarArticulo(ordenSeleccionada.nroOrdenCompra, detalle.nroRenglonDOC)} className="text-red-600 hover:text-red-800">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {ordenSeleccionada.estadoOrdenCompra?.nombreEstadoOC === "Pendiente" && (
                  <div className="flex justify-between flex-row mt-4">
                    <button
                      onClick={() => handleEliminarOrden(ordenSeleccionada.nroOrdenCompra)}
                      className="flex items-center h-[40px] gap-2 bg-red-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar orden
                    </button>

                    <button
                      onClick={() => handleEnviarOrden(ordenSeleccionada.nroOrdenCompra)}
                      className="flex items-center h-[40px] gap-2 bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                      <Check className="w-4 h-4" />
                      Enviar orden
                    </button>
                  </div>
                )}

                {ordenSeleccionada.estadoOrdenCompra?.nombreEstadoOC === "Enviada" && (
                  <button
                    onClick={() => handleFinalizarOrden(ordenSeleccionada.nroOrdenCompra)}
                    className="mt-4 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
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
