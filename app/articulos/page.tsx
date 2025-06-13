'use client';

import { useEffect, useState, useLayoutEffect } from 'react';
import ArticuloCard from '../components/articulos/ArticuloCard';
import ArticulosForm from '../components/articulos/ArticulosForm';
import { Boxes, Plus } from 'lucide-react';
import BackButton from '../components/BackButton';
import { motion, AnimatePresence } from 'framer-motion';
import ArticuloFiltro from '../components/articulos/ArticuloFiltro';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';


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
    const confirmar = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a eliminar el artículo "${articulo.nombreArt}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
    });

    if (!confirmar.isConfirmed) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos/${articulo.codArticulo}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Falló el DELETE');

      await fetchArticulos();

      Swal.fire({
        icon: 'success',
        title: 'Artículo eliminado',
        text: `"${articulo.nombreArt}" fue eliminado correctamente.`,
        confirmButtonColor: '#3085d6',
      });
    } catch (error) {
      console.error('Error eliminando artículo:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al eliminar',
        text: 'No se pudo eliminar el artículo. Puede estar relacionado con ventas u órdenes.',
        confirmButtonColor: '#d33',
      });
    }
  };


  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);

      let registrosExitosos = 0;
      let registrosFallidos: string[] = [];

      const articulosParseados = (json as any[]).map((row, idx) => {
        return {
          index: idx + 2, // para indicar la fila del Excel (asumiendo encabezados)
          payload: {
            nombreArt: row['nombreArt'] || '',
            descripcion: row['descripcion'] || '',
            demanda: Number(row['demanda'] || 0),
            cantArticulo: Number(row['cantArticulo'] || 0),
            cantMaxArticulo: Number(row['cantMaxArticulo'] || 0),
            costoAlmacenamiento: Number(row['costoAlmacenamiento'] || 0),
            costoMantenimiento: Number(row['costoMantenimiento'] || 0),
            costoPedido: Number(row['costoPedido'] || 0),
            costoCompra: Number(row['costoCompra'] || 0),
            desviacionDemandaLArticulo: Number(row['desviacionDemandaLArticulo'] || 0),
            desviacionDemandaTArticulo: Number(row['desviacionDemandaTArticulo'] || 0),
            nivelServicioDeseado: Number(row['nivelServicioDeseado'] || 0),
            modeloInventarioLoteFijo: row['loteOptimo'] != null ? {
              loteOptimo: Number(row['loteOptimo']),
              puntoPedido: Number(row['puntoPedido']),
              stockSeguridadLF: Number(row['stockSeguridadLF'])
            } : undefined,
            modeloInventarioIntervaloFijo: row['intervaloTiempo'] != null ? {
              intervaloTiempo: Number(row['intervaloTiempo']),
              stockSeguridadIF: Number(row['stockSeguridadIF'])
            } : undefined
          }
        };
      });

      for (const row of articulosParseados) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(row.payload),
          });

          if (!res.ok) throw new Error('Error al crear artículo');

          registrosExitosos++;
        } catch (err) {
          console.error(err);
          registrosFallidos.push(`Fila ${row.index} (${row.payload.nombreArt})`);
        }
      }

      fetchArticulos();

      if (registrosExitosos > 0) {
        Swal.fire({
          icon: registrosFallidos.length > 0 ? 'warning' : 'success',
          title: registrosFallidos.length > 0 ? 'Importación parcial' : '¡Importación exitosa!',
          text:
            registrosFallidos.length > 0
              ? `Se importaron ${registrosExitosos} artículos correctamente. Fallaron ${registrosFallidos.length}.`
              : 'Todos los artículos fueron importados correctamente.',
          confirmButtonColor: '#3085d6',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error en la importación',
          text: 'No se pudo importar ningún artículo. Verifica el formato del archivo.',
          confirmButtonColor: '#d33',
        });
      }
    } catch (err) {
      console.error('Error al procesar archivo Excel:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: 'Ocurrió un error al leer o procesar el archivo Excel.',
        confirmButtonColor: '#d33',
      });
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
          <div className="relative">
            <input
              id="excel-upload"
              type="file"
              accept=".xlsx"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
            <label
              htmlFor="excel-upload"
              className="flex items-center justify-center whitespace-nowrap bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition cursor-pointer"
            >
              📁 Importar Excel
            </label>
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
