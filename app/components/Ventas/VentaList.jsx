"use client";

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Pencil, Check, X, Trash2 } from 'lucide-react';

export default function VentasList({ ventas, onSuccess }) {
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [newCantidad, setNewCantidad] = useState("");

  if (!ventas || !Array.isArray(ventas) || !ventas.length) {
    return <p className="text-gray-600">No hay ventas registradas.</p>;
  }

  const handleEliminarVenta = async (nroVenta) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta venta?')) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ventas/${nroVenta}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setVentaSeleccionada(null);
      onSuccess?.();
    } else {
      alert('Error al eliminar la venta.');
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
  };

  const saveEditing = (detalle) => {
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
              <div>
                <h3 className="text-gray-800 font-semibold">
                  Venta #{venta.nroVenta}
                </h3>
                <p className="text-xs text-gray-500">
                  {venta.fechaVenta ? new Date(venta.fechaVenta).toLocaleDateString() : ''}
                </p>
              </div>
              <p className="text-base font-semibold text-gray-800">${venta.montoTotalVenta}</p>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <h4 className="text-sm text-gray-700 font-medium">Artículos:</h4>
              {venta.detalleVenta && venta.detalleVenta.length > 0 ? (
                <ul className="text-sm text-gray-600 mt-1 list-disc list-inside space-y-1">
                  {venta.detalleVenta.slice(0, 2).map((d) => (
                    <li key={d.nroRenglonDV} className="truncate">
                      {d.articulo?.nombreArt ?? 'Artículo sin nombre'} ({d.cantidad}x)
                    </li>
                  ))}
                  {venta.detalleVenta.length > 2 && (
                    <li className="text-xs text-gray-500 italic">
                      ...y {venta.detalleVenta.length - 2} más
                    </li>
                  )}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic mt-1">Sin artículos</p>
              )}
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
                className="bg-white max-w-lg w-full p-6 rounded-lg shadow-xl relative"
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
                <ul className="space-y-3 divide-y divide-gray-200">
                  {ventaSeleccionada.detalleVenta?.map((detalle, index) => (
                    <li key={detalle.nroRenglonDV} className="pt-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-800 font-medium">{detalle.articulo?.nombreArt}</p>
                          <p className="text-sm text-gray-600">
                            Código: {detalle.articulo?.codArticulo}
                          </p>
                          <p className="text-sm text-gray-600">
                            Cantidad: {editandoIndex === index ? (
                              <input
                                type="number"
                                value={newCantidad}
                                onChange={(e) => setNewCantidad(e.target.value)}
                                className="border rounded px-2 py-1 w-16 ml-2"
                              />
                            ) : (
                              detalle.cantidad
                            )}
                          </p>
                          <p className="text-sm text-gray-600">
                            Subtotal: ${detalle.montoDetalleVenta}
                          </p>
                        </div>

                        <div className="flex flex-col items-center gap-1">
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
                    </li>
                  ))}
                </ul>

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