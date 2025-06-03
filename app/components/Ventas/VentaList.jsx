"use client";

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Pencil, Check, X, Trash2 } from 'lucide-react';

export default function VentasList({ ventas, onSuccess }) {
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [newCantidad, setNewCantidad] = useState("");

  if (!ventas.length) {
    return <p className="text-black">No hay ventas registradas.</p>;
  }

  const handleEliminarVenta = async (nroVenta) => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar esta venta?');
    if (!confirmar) return;

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
    const updatedDetalleVenta = ventaSeleccionada.detalleVenta.map(d =>
      d.nroRenglonDV === nroRenglonDV
        ? { 
            ...d, 
            cantidad: nuevaCantidad, 
            montoDetalleVenta: nuevaCantidad * d.precioUnitario // recalcular
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

    onSuccess?.(); // si querés que recargue la lista general
  } else {
    alert('Error al actualizar la cantidad.');
  }
};


 const handleEliminarArticulo = async (nroRenglonDV) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/venta-detalle/${nroRenglonDV}`, {
    method: 'DELETE',
  });

  if (res.ok) {
    const updatedDetalleVenta = ventaSeleccionada.detalleVenta.filter(
      (d) => d.nroRenglonDV !== nroRenglonDV
    );

    const updatedMontoTotal = updatedDetalleVenta.reduce(
      (total, d) => total + d.montoDetalleVenta,
      0
    );

    setVentaSeleccionada({
      ...ventaSeleccionada,
      detalleVenta: updatedDetalleVenta,
      montoTotalVenta: updatedMontoTotal,
    });

    onSuccess?.(); // opcional si querés actualizar lista general

  } else {
    alert("Error al eliminar el artículo");
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
            className="border border-gray-200 rounded p-4 shadow-sm bg-white cursor-pointer hover:scale-[1.01] transition-transform"
            onClick={() => setVentaSeleccionada(venta)}
          >
            <h3 className="font-semibold text-black">
              Venta #{venta.nroVenta} - Fecha: {new Date(venta.fechaVenta).toLocaleDateString()} - Monto: (${venta.montoTotalVenta})
            </h3>
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
                className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative"
              >
                <button
                  onClick={() => setVentaSeleccionada(null)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                  title="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl text-black font-bold mb-2">
                  Venta #{ventaSeleccionada.nroVenta}
                </h2>
                <p className="mb-2 text-black">
                  Fecha: {new Date(ventaSeleccionada.fechaVenta).toLocaleDateString()}
                </p>
                <p className="mb-4 text-black">
                  Monto total: <span className="font-semibold">${ventaSeleccionada.montoTotalVenta}</span>
                </p>

                <h3 className="font-semibold mb-2 text-black">Artículos Vendidos:</h3>
                <ul className="text-sm text-black space-y-4">
                  {ventaSeleccionada.detalleVenta.map((detalle, index) => (
                    <li
                      key={detalle.articulo.codArticulo}
                      className="flex justify-between items-start border-b pb-2"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{detalle.articulo.nombreArt}</p>
                        <div className="mt-1 space-y-1 text-sm">
                          <div><strong>Código:</strong> {detalle.articulo.codArticulo}</div>
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
                              detalle.cantidad
                            )}
                          </div>
                          <div><strong>Subtotal:</strong> ${detalle.montoDetalleVenta}</div>
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
                        <button onClick={() => startEditing(index, detalle.cantidad)} className="text-blue-600 hover:text-blue-800 ml-2">
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}

                      <button onClick={() => handleEliminarArticulo(detalle.nroRenglonDV)} className="text-red-600 hover:text-red-800 ml-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleEliminarVenta(ventaSeleccionada.nroVenta)}
                  className="mt-6 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar venta
                </button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
