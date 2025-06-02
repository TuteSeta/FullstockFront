'use client';

import { useEffect, useState, useLayoutEffect } from 'react';
import ArticuloCard from '../components/articulos/ArticuloCard';
import ArticulosForm from '../components/articulos/ArticulosForm';
import { Boxes, Plus } from 'lucide-react';
import BackButton from '../components/BackButton';
import { motion, AnimatePresence } from 'framer-motion';
import ArticuloFiltro from '../components/articulos/ArticuloFiltro';



type Articulo = {
  codArticulo: number;
  nombreArt: string;
  descripcion: string;
  cantArticulo: number;
  cantMaxArticulo: number;
  modeloInventario: string;
  stockSeguridad: number;
};

export default function ArticulosPage() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<Articulo | null>(null);
  const [filtros, setFiltros] = useState<{ nombre?: string }>({});
  const [page, setPage] = useState(1);
  const pageSize = 5;


  const fetchArticulos = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos`);
    const data = await res.json();
    setArticulos(data);
  };

  useEffect(() => {
    fetchArticulos();
  }, []);

  const handleEdit = (articulo: Articulo) => {
    setArticuloSeleccionado(articulo);
    setMostrarFormulario(true);
  };

  const handleDelete = async (articulo: Articulo) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos/${articulo.codArticulo}`, {
        method: 'DELETE',
      });
      fetchArticulos();
    } catch (error) {
      console.error('Error eliminando artículo:', error);
    }
  };

  const articulosFiltrados = articulos.filter((a) =>
    filtros.nombre ? a.nombreArt.toLowerCase().includes(filtros.nombre.toLowerCase()) : true
  );

  const totalPages = Math.max(1, Math.ceil(articulosFiltrados.length / pageSize));

  useEffect(() => {
    setPage(1); // Reinicia la página al aplicar filtros
  }, [filtros, pageSize]);

  // Asegura que no quede una página inválida si se reduce el número total
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const articulosPaginados = articulosFiltrados.slice((page - 1) * pageSize, page * pageSize);

  return (
    <main className="min-h-screen bg-gray-100 text-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <BackButton />

        {/* Encabezado responsive */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center">
            <Boxes className="w-7 h-7 text-blue-600" />
            <h1 className="text-3xl font-bold ml-2">Gestión de artículos</h1>
          </div>

          <div className="flex-1">
            <ArticuloFiltro onFiltrar={setFiltros} />
          </div>

          <button
            onClick={() => {
              setArticuloSeleccionado(null);
              setMostrarFormulario(true);
            }}
            className="flex items-center justify-center whitespace-nowrap bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <Plus className="mr-2" />
            Agregar artículo
          </button>
        </div>

        {/* Encabezado de tabla */}
        <div className="hidden sm:grid grid-cols-6 gap-4 mb-4 p-4 bg-gray-200 rounded-lg text-sm font-semibold">
          <div>Nombre</div>
          <div className="text-center">Código</div>
          <div className="text-center">Cantidad</div>
          <div className="text-center">Cantidad Máx.</div>
          <div className="text-center">Modelo</div>
          <div className="text-center">Stock Seguridad</div>
        </div>


        {/* Lista de artículos paginados */}
        <div className="space-y-2 max-sm:max-h-[60vh] max-sm:overflow-y-auto">
          {articulosPaginados.map((articulo) => (
            <ArticuloCard
              key={articulo.codArticulo}
              articulo={articulo}
              onEdit={() => handleEdit(articulo)}
              onDelete={() => handleDelete(articulo)}
            />
          ))}
        </div>

        {/* Controles de paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4 flex-wrap">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ← Anterior
            </button>

            <span className="text-sm text-gray-700">
              Página {page} de {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Siguiente →
            </button>
          </div>
        )}

        {/* Modal de formulario */}
        <AnimatePresence>
          {mostrarFormulario && (
            <>
              <motion.div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMostrarFormulario(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-50 flex items-center justify-center px-4"
              >
                <div
                  className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full text-gray-800 relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setMostrarFormulario(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center transition hover:bg-gray-200"
                    title="Cerrar"
                  >
                    ×
                  </button>

                  <ArticulosForm
                    articulo={articuloSeleccionado}
                    onSuccess={() => {
                      fetchArticulos();
                      setMostrarFormulario(false);
                    }}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
