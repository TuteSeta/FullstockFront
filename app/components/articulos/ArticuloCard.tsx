'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart_SVG } from '../articulos/GraficoArt';

export type Venta = {
  codArticulo: number;
  cantidadVendida: number;
  fecha: string;
};

export type Articulo = {
  codArticulo: number;
  nombreArt: string;
  descripcion: string;
  cantArticulo: number;
  cantMaxArticulo: number;
  costoAlmacenamiento?: number;
  costoMantenimiento?: number;
  costoPedido?: number;
  costoCompra?: number;
  desviacionDemandaLArticulo?: number;
  desviacionDemandaTArticulo?: number;
  nivelServicioDeseado?: number;
  modeloInventarioIntervaloFijo?: { stockSeguridadIF: number };
  modeloInventarioLoteFijo?: { stockSeguridadLF: number };
};

function generarHistorialStock(
  ventas: Venta[],
  codArticulo: number,
  cantidadActual: number
) {
  const historial: { fecha: string; stock: number }[] = [];
  let stock = cantidadActual;

  ventas.forEach((venta) => {
    if (venta.codArticulo === codArticulo) {
      stock -= venta.cantidadVendida;
      historial.push({ fecha: venta.fecha, stock });
    }
  });

  return historial;
}

export default function ArticuloCard({
  articulo,
  ventas,
  onEdit,
  onDelete,
}: {
  articulo: Articulo;
  ventas: Venta[];
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expandido, setExpandido] = useState(false);

  const modelo = articulo.modeloInventarioLoteFijo ? 'Lote Fijo' : 'Intervalo Fijo';
  const stockSeguridad =
    articulo.modeloInventarioLoteFijo?.stockSeguridadLF ??
    articulo.modeloInventarioIntervaloFijo?.stockSeguridadIF ??
    'N/A';

  const historialStock = generarHistorialStock(
    ventas,
    articulo.codArticulo,
    articulo.cantArticulo
  );

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

                <div className="grid grid-cols-2 text-xs gap-x-6 gap-y-2 mt-4">
                  <p><strong>Cantidad Actual:</strong> {articulo.cantArticulo}</p>
                  <p><strong>Cantidad Máxima:</strong> {articulo.cantMaxArticulo}</p>
                  <p><strong>Modelo de Inventario:</strong> {modelo}</p>
                  <p><strong>Stock de Seguridad:</strong> {stockSeguridad}</p>
                  <p><strong>Costo de Almacenamiento:</strong> {articulo.costoAlmacenamiento ?? 'N/A'}</p>
                  <p><strong>Costo de Mantenimiento:</strong> {articulo.costoMantenimiento ?? 'N/A'}</p>
                  <p><strong>Costo de Pedido:</strong> {articulo.costoPedido ?? 'N/A'}</p>
                  <p><strong>Costo de Compra:</strong> {articulo.costoCompra ?? 'N/A'}</p>
                  <p><strong>Desviación de Demanda (L):</strong> {articulo.desviacionDemandaLArticulo ?? 'N/A'}</p>
                  <p><strong>Desviación de Demanda (T):</strong> {articulo.desviacionDemandaTArticulo ?? 'N/A'}</p>
                  <p><strong>Servicio Deseado:</strong> {articulo.nivelServicioDeseado ?? 'N/A'}</p>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Evolución del stock</h3>
                  <LineChart_SVG />
                </div>

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
