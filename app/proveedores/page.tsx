"use client";
import { useState, useEffect } from 'react';
import ProveedoresForm from '../components/proveedores/ProveedoresForm';
import ProveedorCard from '../components/proveedores/ProveedorCard';
import { Truck, Plus } from 'lucide-react';
import BackButton from '../components/BackButton';

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
    <main className="min-h-screen bg-gray-100 text-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <BackButton />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Truck className="w-7 h-7 text-blue-600" />
            <h1 className="text-3xl font-bold ml-2">Gestión de proveedores</h1>
          </div>

          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <Plus className="mr-2" />
            {mostrarFormulario ? 'Cerrar formulario' : 'Agregar proveedor'}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Cards de proveedores */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {proveedores.map((proveedor) => (
              <ProveedorCard key={proveedor.codProveedor} proveedor={proveedor} />
            ))}
          </div>

          {/* Formulario al costado */}
          {mostrarFormulario && (
            <div className="w-full max-w-sm bg-white p-4 rounded shadow h-fit">
              <ProveedoresForm onSuccess={() => {
                fetchProveedores();
                setMostrarFormulario(false);
              }} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
