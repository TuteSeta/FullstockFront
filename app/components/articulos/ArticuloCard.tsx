'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Articulo = {
  codArticulo: number;
  nombreArt: string;
  descripcion: string;
  cantArticulo: number;
  precioArticulo: number;
  modeloInventarioIntervaloFijo?: {
    stockSeguridadIF: number;
    inventarioMaximo: number;
    intervaloTiempo: number;
  };
  modeloInventarioLoteFijo?: { stockSeguridadLF: number, loteOptimo: number, puntoPedido: number, };
  proveedorPredeterminado?: {
    nombreProveedor: string;
  };
};

export default function ArticuloCard({
  articulo,
  onEdit,
  onDelete,
}: {
  articulo: Articulo;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expandido, setExpandido] = useState(false);

  const modelo = articulo.modeloInventarioLoteFijo ? 'Lote Fijo' : 'Intervalo Fijo';
  const stockSeguridad =
    articulo.modeloInventarioLoteFijo?.stockSeguridadLF ??
    articulo.modeloInventarioIntervaloFijo?.stockSeguridadIF ??
    'N/A';

  return (
    <>
      <div
        onClick={() => setExpandido(true)}
        className="w-full bg-white shadow rounded-lg p-4 mb-4 cursor-pointer grid grid-cols-1 sm:grid-cols-6 gap-4 sm:items-center"
      >
        <div className="text-sm text-gray-700">
          <span className="block sm:hidden font-semibold">Nombre: </span>
          {articulo.nombreArt}
        </div>
        <div className="text-sm text-gray-700 sm:text-center">
          <span className="block sm:hidden font-semibold">Código: </span>
          {articulo.codArticulo}
        </div>
        <div className="text-sm text-gray-700 sm:text-center">
          <span className="block sm:hidden font-semibold">Cantidad: </span>
          {articulo.cantArticulo}
        </div>
        <div className="text-sm text-gray-700 sm:text-center">
          <span className="block sm:hidden font-semibold">Modelo: </span>
          {modelo}
        </div>
        <div className="text-sm text-gray-700 sm:text-center">
          <span className="block sm:hidden font-semibold">Precio: </span>
          {articulo.precioArticulo}
        </div>
        <div className="text-sm text-gray-700 sm:text-center">
          <span className="block sm:hidden font-semibold">Stock Seguridad: </span>
          {stockSeguridad}
        </div>
      </div>

      <AnimatePresence>
        {expandido && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setExpandido(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full text-gray-800 relative"
              >
                <button
                  onClick={() => setExpandido(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center transition hover:bg-gray-200"
                  title="Cerrar"
                >
                  ×
                </button>

                <h2 className="text-2xl font-bold text-gray-900 mb-1">{articulo.nombreArt}</h2>
                <p className="text-sm text-gray-500 mb-4">Código: {articulo.codArticulo}</p>
                <p className="mb-4 text-gray-700">{articulo.descripcion}</p>
                <p>
                  <strong>Cantidad Actual:</strong> {articulo.cantArticulo}
                </p>
                <p>
                  <strong>Precio articulo:</strong> {articulo.precioArticulo}
                </p>
                <p>
                  <strong>Modelo de Inventario:</strong> {modelo}
                </p>
                <p>
                  <strong>Proveedor Predeterminado:</strong>{' '}
                  {articulo.proveedorPredeterminado?.nombreProveedor ?? 'No asignado'}
                </p>
                {articulo.modeloInventarioLoteFijo && (
                  <>
                    <p>
                      <strong>Lote Óptimo:</strong> {articulo.modeloInventarioLoteFijo.loteOptimo}
                    </p>
                    <p>
                      <strong>Punto de Pedido:</strong> {articulo.modeloInventarioLoteFijo.puntoPedido}
                    </p>
                    <p>
                      <strong>Stock de Seguridad:</strong> {articulo.modeloInventarioLoteFijo.stockSeguridadLF}
                    </p>
                  </>
                )}
                {articulo.modeloInventarioIntervaloFijo && (
                  <>
                    <p>
                      <strong>Intervalo de Tiempo:</strong> {articulo.modeloInventarioIntervaloFijo.intervaloTiempo} días
                    </p>
                    <p>
                      <strong>Inventario Máximo:</strong> {articulo.modeloInventarioIntervaloFijo.inventarioMaximo}
                    </p>
                    <p>
                      <strong>Stock de Seguridad:</strong> {articulo.modeloInventarioIntervaloFijo.stockSeguridadIF}
                    </p>
                  </>
                )}

                <div className="mt-4 flex flex-wrap justify-end gap-2">
                  <button
                    onClick={() => {
                      onEdit();
                      setExpandido(false);
                    }}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      onDelete();
                      setExpandido(false);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
