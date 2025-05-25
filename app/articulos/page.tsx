'use client';

import { useEffect, useState } from 'react';
import ArticulosForm from '../components/articulos/ArticulosForm';
import ArticuloCard from '../components/articulos/ArticuloCard'; // nuevo componente
import { Boxes, Plus } from 'lucide-react';
import BackButton from '../components/BackButton';

type Articulo = {
  codArticulo: number;
  nombreArt: string;
  descripcion: string;
};

export default function ArticulosPage() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const fetchArticulos = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos`);
    const data = await res.json();
    setArticulos(data);
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
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <Plus className="mr-2" />
            {mostrarFormulario ? 'Cerrar formulario' : 'Agregar artículo'}
          </button>
        </div>

        <div className="flex gap-8">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articulos.map((articulo) => (
              <ArticuloCard key={articulo.codArticulo} articulo={articulo} />
            ))}
          </div>

          {mostrarFormulario && (
            <div className="w-full max-w-sm bg-white p-4 rounded shadow h-fit">
              <ArticulosForm onSuccess={() => {
                fetchArticulos();
                setMostrarFormulario(false);
              }} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
