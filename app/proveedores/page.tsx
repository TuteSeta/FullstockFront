'use client';
import { useState, useEffect } from 'react';
import ProveedoresForm from '../components/proveedores/ProveedoresForm';
import ProveedorCard from '../components/proveedores/ProveedorCard';
import { Truck, Plus } from 'lucide-react';
import BackButton from '../components/BackButton';
import { motion, AnimatePresence } from 'framer-motion';

type Proveedor = {
  codProveedor: number;
  nombreProveedor: string;
  fechaHoraBajaProveedor?: string | null;
};

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const fetchProveedores = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedores`);
    const data = await res.json();
    setProveedores(data);
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 text-gray-800 px-4 sm:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <BackButton />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center">
            <Truck className="w-7 h-7 text-blue-600" />
            <h1 className="text-3xl font-bold ml-2">Gestión de proveedores</h1>
          </div>

          <button
            onClick={() => setMostrarFormulario(true)}
            className="w-full sm:w-auto flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition"
          >
            <Plus className="mr-2" />
            Agregar proveedor
          </button>
        </div>

        {/* Encabezado tipo tabla */}
        <div className="hidden sm:grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-200 rounded-lg">
          <div className="font-semibold">Nombre</div>
          <div className="font-semibold text-center">Baja</div>
        </div>

        {/* Lista de proveedores */}
        <div className="flex flex-col gap-4">
          {proveedores.map((proveedor) => (
            <ProveedorCard key={proveedor.codProveedor} proveedor={proveedor} />
          ))}
        </div>

        {/* Modal del formulario */}
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

                  <ProveedoresForm
                    onSuccess={() => {
                      fetchProveedores();
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
