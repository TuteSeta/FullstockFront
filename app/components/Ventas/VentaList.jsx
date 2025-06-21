"use client";

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Pencil, Check, X, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function VentasList({ ventas, onSuccess }) {
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [newCantidad, setNewCantidad] = useState("");
  const [cantidadError, setCantidadError] = useState("");

  if (!ventas || !Array.isArray(ventas) || !ventas.length) {
    return <p className="text-gray-600">No hay ventas registradas.</p>;
  }

  const handleEliminarVenta = async (nroVenta) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la venta de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ventas/${nroVenta}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'La venta fue eliminada exitosamente.',
          confirmButtonColor: '#16a34a'
        });
        setVentaSeleccionada(null);
        onSuccess?.();
      } else {
        Swal.fire('Error', 'No se pudo eliminar la venta.', 'error');
      }
    }
  };

  const handleEditarArticulo = async (nroRenglonDV, nuevaCantidad) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/venta-detalle/${nroRenglonDV}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nuevaCantidad }),
    });

    if (res.ok) {
      const updatedDetalleVenta = ventaSeleccionada.detalleVenta.map((d) =>
        d.nroRenglonDV === nroRenglonDV
          ? {
              ...d,
              cantidad: nuevaCantidad,
              montoDetalleVenta: nuevaCantidad * d.precioUnitario,
            }
          : d
      );

      const updatedVenta = {
        ...ventaSeleccionada,
        detalleVenta: updatedDetalleVenta,
        montoTotalVenta: updatedDetalleVenta.reduce((total, d) => total + d.montoDetalleVenta, 0),
      };

      setVentaSeleccionada(updatedVenta);
      setEditandoIndex(null);
      onSuccess?.();
    } else {
      alert('Error al actualizar la cantidad.');
    }
  };

  const handleEliminarArticulo = async (nroRenglonDV) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/venta-detalle/${nroRenglonDV}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      const updatedDetalleVenta = ventaSeleccionada.detalleVenta.filter((d) => d.nroRenglonDV !== nroRenglonDV);
      const updatedMontoTotal = updatedDetalleVenta.reduce((total, d) => total + d.montoDetalleVenta, 0);

      setVentaSeleccionada({
        ...ventaSeleccionada,
        detalleVenta: updatedDetalleVenta,
        montoTotalVenta: updatedMontoTotal,
      });

      onSuccess?.();
    } else {
      alert('Error al eliminar el artículo');
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
    handleEditarArticulo(detalle.nroRenglonDV, Number(newCantidad));
  };

  return (
    <>
      <div className="grid gap-4">
        {ventas.map((venta) => (
          <div
            key={venta.nroVenta}
            className="border-l-4 border-blue-500 bg-white rounded-lg shadow p-4 hover:shadow-lg cursor-pointer transition-shadow duration-300"
            onClick={() => setVentaSeleccionada(venta)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-grow pr-4">
                <div className="flex items-baseline flex-wrap gap-x-2">
                  <h3 className="text-gray-800 font-semibold">
                    Venta #{venta.nroVenta}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    - {venta.detalleVenta && venta.detalleVenta.length > 0
                      ? `${venta.detalleVenta[0].articulo?.nombreArt ?? 'N/A'} (x${venta.detalleVenta[0].cantidad})`
                      : 'Sin artículos'}
                    {venta.detalleVenta?.length > 1 && ` y ${venta.detalleVenta.length - 1} más...`}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {venta.fechaVenta ? new Date(venta.fechaVenta).toLocaleDateString() : ''}
                </p>
              </div>
              <p className="text-base font-semibold text-gray-800 flex-shrink-0">${venta.montoTotalVenta}</p>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {ventaSeleccionada && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setVentaSeleccionada(null)}
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
                className="bg-white max-w-3xl w-full p-6 rounded-lg shadow-xl relative"
              >
                <button
                  onClick={() => setVentaSeleccionada(null)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Venta #{ventaSeleccionada.nroVenta}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  Fecha: {ventaSeleccionada.fechaVenta ? new Date(ventaSeleccionada.fechaVenta).toLocaleDateString() : ''}
                </p>
                <p className="mb-4 font-medium text-gray-800">
                  Total: ${ventaSeleccionada.montoTotalVenta}
                </p>

                <h3 className="font-semibold mb-2 text-gray-700">Artículos Vendidos:</h3>

                <div className="grid grid-cols-5 gap-4 bg-gray-200 p-2 rounded text-sm font-semibold text-black mb-2">
                  <div>Nombre</div>
                  <div>Código</div>
                  <div className="text-center">Cantidad</div>
                  <div className="text-center">Subtotal</div>
                  <div className="text-center">Acciones</div>
                </div>

                <div
                  className="space-y-2 overflow-y-auto pr-1"
                  style={{
                    maxHeight: ventaSeleccionada.detalleVenta.length > 3 ? "200px" : "none"
                  }}
                >
                  {ventaSeleccionada.detalleVenta?.map((detalle, index) => (
                    <div
                      key={detalle.nroRenglonDV}
                      className="grid grid-cols-5 gap-4 bg-white p-2 rounded shadow-sm items-center text-sm text-black"
                    >
                      <div>{detalle.articulo?.nombreArt}</div>
                      <div>{detalle.articulo?.codArticulo}</div>
                      <div className="text-center">
                        {editandoIndex === index ? (
                          <div className="flex justify-center items-center gap-1">
                            <input
                              type="number"
                              min={1}
                              value={newCantidad}
                              onChange={(e) => {
                                setNewCantidad(e.target.value);
                                setCantidadError("");
                              }}
                              className="border rounded px-1 py-0.5 w-16 text-center"
                            />
                          </div>
                        ) : (
                          detalle.cantidad
                        )}
                        {editandoIndex === index && cantidadError && (
                          <div className="text-red-600 text-xs mt-1 col-span-5">{cantidadError}</div>
                        )}
                      </div>
                      <div className="text-center">${detalle.montoDetalleVenta}</div>
                      <div className="flex justify-center gap-2">
                        {editandoIndex === index ? (
                          <>
                            <button onClick={() => saveEditing(detalle)} className="text-green-600 hover:text-green-800">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditandoIndex(null)} className="text-gray-500 hover:text-gray-700">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button onClick={() => startEditing(index, detalle.cantidad)} className="text-blue-600 hover:text-blue-800">
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => handleEliminarArticulo(detalle.nroRenglonDV)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleEliminarVenta(ventaSeleccionada.nroVenta)}
                  className="mt-6 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  <Trash2 className="w-5 h-5" /> Eliminar venta
                </button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}