'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Articulo = {
  codArticulo: number;
  nombreArt: string;
  descripcion: string;
  cantArticulo: number;
  cantMaxArticulo: number;
  modeloInventarioIntervaloFijo?: { stockSeguridadIF: number };
  modeloInventarioLoteFijo?: { stockSeguridadLF: number };
};

export default function ArticuloCard({ articulo, onEdit, onDelete }: { articulo: Articulo, onEdit: () => void, onDelete: () => void }) {
  const [expandido, setExpandido] = useState(false);

  const modelo = articulo.modeloInventarioLoteFijo ? 'Lote Fijo' : 'Intervalo Fijo';
  const stockSeguridad = articulo.modeloInventarioLoteFijo?.stockSeguridadLF ??
                         articulo.modeloInventarioIntervaloFijo?.stockSeguridadIF ??
                         'N/A';

  return (
    <>
      <div
        onClick={() => setExpandido(true)}
        className="grid grid-cols-6 gap-4 bg-white shadow rounded-lg p-4 mb-4 w-full cursor-pointer"
      >
        <div className="flex items-center ">
          <h2 className="text-sm font-semibold text-gray-500">{articulo.nombreArt}</h2>
        </div>
        <div className="flex items-center justify-center">
          <p className="text-sm text-gray-700">{articulo.codArticulo}</p>
        </div>
        <div className="flex items-center justify-center">
          <p className="text-sm text-gray-700">{articulo.cantArticulo}</p>
        </div>
        <div className="flex items-center justify-center">
          <p className="text-sm text-gray-700 ">{articulo.cantMaxArticulo}</p>
        </div>
        <div className="flex items-center justify-center">
          <p className="text-sm text-gray-700">{modelo}</p>
        </div>
        <div className="flex items-center justify-center">
          <p className="text-sm text-gray-700">{stockSeguridad}</p>
        </div>
      </div>

      {/* Modal expandido */}
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
              className="fixed inset-0 z-50 flex items-center justify-center"
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
                <p><strong>Cantidad Actual:</strong> {articulo.cantArticulo}</p>
                <p><strong>Cantidad Máxima:</strong> {articulo.cantMaxArticulo}</p>
                <p><strong>Modelo de Inventario:</strong> {modelo}</p>
                <p><strong>Stock de Seguridad:</strong> {stockSeguridad}</p>

                {/* Botones para editar y eliminar */}
                <div className="mt-4 flex justify-end space-x-2">
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