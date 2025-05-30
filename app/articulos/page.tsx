'use client';
import { useEffect, useState } from 'react';
import ArticuloCard from '../components/articulos/ArticuloCard';
import ArticulosForm from '../components/articulos/ArticulosForm';
import { Boxes, Plus } from 'lucide-react';
import BackButton from '../components/BackButton';
import { motion, AnimatePresence } from 'framer-motion';

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

  const fetchArticulos = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos`);
    const data = await res.json();
    setArticulos(data);
  };

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

  useEffect(() => {
    fetchArticulos();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 text-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <BackButton />
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Boxes className="w-7 h-7 text-blue-600" />
            <h1 className="text-3xl font-bold ml-2">Gestión de artículos</h1>
          </div>
          <button
            onClick={() => {
              setArticuloSeleccionado(null);
              setMostrarFormulario(true);
            }}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition"
          >
            <Plus className="mr-2" />
            Agregar artículo
          </button>
        </div>

        {/* Encabezado de la tabla */}
        <div className="grid grid-cols-6 gap-4 mb-4 p-4 bg-gray-200 rounded-lg">
          <div className="font-semibold">Nombre</div>
          <div className="font-semibold text-center">Código</div>
          <div className="font-semibold text-center">Cantidad</div>
          <div className="font-semibold text-center">Cantidad Máx.</div>
          <div className="font-semibold text-center">Modelo</div>
          <div className="font-semibold text-center">Stock Seguridad</div>
        </div>

        {/* Lista de artículos */}
        <div>
          {articulos.map(articulo => (
            <ArticuloCard
              key={articulo.codArticulo}
              articulo={articulo}
              onEdit={() => handleEdit(articulo)}
              onDelete={() => handleDelete(articulo)}
            />
          ))}
        </div>

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
                className="fixed inset-0 z-50 flex items-center justify-center"
              >
                <div
                  className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full text-gray-800 relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Botón de cierre */}
                  <button
                    onClick={() => setMostrarFormulario(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center transition hover:bg-gray-200"
                    title="Cerrar"
                  >
                    ×
                  </button>

                  {/* Contenido del formulario */}
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