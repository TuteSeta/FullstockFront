'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import ArticulosProveedorList from './ArticulosProveedorList';
import ArticuloProveedorForm from './ArticuloProveedorForm';
import Swal from 'sweetalert2';

type Proveedor = {
  codProveedor: number;
  nombreProveedor: string;
  fechaHoraBajaProveedor?: string | null;
};

export type ArticuloProveedor = {
  codArticulo: number;
  articulo: {
    nombreArt: string;
    descripcion: string;
  };
  costoUnitarioAP: number;
  cargoPedidoAP: number;
  demoraEntregaAP: number;
};

export default function ProveedorCard({ proveedor }: { proveedor: Proveedor }) {
  const [expandido, setExpandido] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formData, setFormData] = useState({ ...proveedor });
  const [articulos, setArticulos] = useState<ArticuloProveedor[]>([]);

  const fetchArticulosProveedor = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/proveedor-articulos/proveedor/${proveedor.codProveedor}`
    );
    const data = await res.json();
    setArticulos(data);
  };

  const articulosAsignados = articulos.map((a) => a.codArticulo);

  useEffect(() => {
    if (expandido) fetchArticulosProveedor();
  }, [expandido]);

  return (
    <>
      {/* Card simple */}
      <div
        onClick={() => setExpandido(true)}
        className="cursor-pointer bg-white shadow rounded-lg p-4 transition-all duration-300 hover:scale-[1.01]"
      >
        {/* Vista mobile */}
        <div className="text-gray-900 text-base font-semibold sm:hidden">
          <div>
            <span className="block sm:hidden font-semibold">Nombre:</span> {proveedor.nombreProveedor}
          </div>
          <div>
            <span className="block sm:hidden font-semibold">Código:</span> {proveedor.codProveedor}
          </div>
        </div>

        {/* Vista escritorio */}
        <div className="hidden sm:grid grid-cols-2 text-sm font-semibold text-gray-900">
          <span  >{proveedor.nombreProveedor}</span>
          <span className="text-center">{proveedor.codProveedor}</span>
        </div>
      </div>

      {/* Modal expandido */}
      <AnimatePresence>
        {expandido && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-white/10 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setExpandido(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 flex items-center justify-center"
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[95vw] sm:max-w-[700px] lg:max-w-[900px] xl:max-w-[1100px] max-h-[90vh] overflow-y-auto text-gray-800 relative"
              >
                {/* Botón cerrar */}
                <button
                  onClick={() => setExpandido(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center transition hover:bg-gray-200"
                  title="Cerrar"
                >
                  ×
                </button>

                {modoEdicion ? (
                  <input
                    type="text"
                    value={formData.nombreProveedor}
                    onChange={(e) =>
                      setFormData({ ...formData, nombreProveedor: e.target.value })
                    }
                    className="text-2xl font-bold border px-2 py-1 rounded w-full mb-2"
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{proveedor.nombreProveedor}</h2>
                )}

                <p className="text-sm text-gray-500 mb-4">
                  Código de proveedor: {proveedor.codProveedor}
                </p>

                {/* Título y botones */}
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => setModoEdicion(!modoEdicion)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                    title="Editar"
                  >
                    <Pencil className="w-5 h-5" />
                    <span className="text-sm">Editar</span>
                  </button>

                  <button
                    onClick={async () => {
                      const confirm = await Swal.fire({
                        title: '¿Seguro que querés eliminar este proveedor?',
                        text: 'Esta acción dará de baja el proveedor si es posible.',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, eliminar',
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#aaa',
                      });
                      if (!confirm.isConfirmed) return;

                      try {
                        const res = await fetch(
                          `${process.env.NEXT_PUBLIC_API_URL}/proveedores/${proveedor.codProveedor}`,
                          {
                            method: 'DELETE',
                          }
                        );
                        const data = await res.json();

                        if (!res.ok) {
                          throw new Error(data.error || 'No se pudo eliminar');
                        }

                        await Swal.fire({
                          icon: 'success',
                          title: 'Proveedor eliminado',
                          text: 'El proveedor fue dado de baja correctamente.',
                          confirmButtonColor: '#3085d6',
                        });
                        setExpandido(false);
                        if (typeof window !== 'undefined' && window.dispatchEvent) {
                          window.dispatchEvent(new Event('recargarProveedores'));
                        }
                      } catch (error: any) {
                        await Swal.fire({
                          icon: 'error',
                          title: 'No se pudo eliminar',
                          text: error.message,
                          confirmButtonColor: '#d33',
                        });
                      }
                    }}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
                    title="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="text-sm">Eliminar</span>
                  </button>
                </div>

                {/* Artículos */}
                <ArticulosProveedorList
                  proveedorId={proveedor.codProveedor}
                  articulos={articulos}
                  onDelete={fetchArticulosProveedor}
                />

                {/* Formulario para asignar artículos */}
                <button
                  onClick={() => setMostrarFormulario(!mostrarFormulario)}
                  className="mt-4 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
                >
                  {mostrarFormulario ? 'Cancelar' : 'Añadir artículo'}
                </button>

                {mostrarFormulario && (
                  <ArticuloProveedorForm
                    proveedorId={proveedor.codProveedor}
                    articulosAsignados={articulosAsignados}
                    onSuccess={() => {
                      fetchArticulosProveedor();
                      setMostrarFormulario(false);
                    }}
                  />
                )}

                {/* Botón guardar cambios */}
                {modoEdicion && (
                  <button
                    onClick={async () => {
                      await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/proveedores/${proveedor.codProveedor}`,
                        {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(formData),
                        }
                      );
                      setModoEdicion(false);
                    }}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Guardar cambios
                  </button>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
