"use client";
import { useState, useEffect } from 'react';
import ProveedoresForm from '../components/proveedores/ProveedoresForm';
import ProveedoresList from '../components/proveedores/ProveedoresList';
import { Truck } from 'lucide-react';
import BackButton from '../components/BackButton'
export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState([]);

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
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <BackButton />
        <div className='flex items-center mb-4'>
          <Truck className="w-7 h-7 text-blue-600" />
          <h1 className="text-3xl font-bold ml-2">Gestión de proveedores</h1>
        </div>
        <ProveedoresForm onSuccess={fetchProveedores} />
        <hr className="my-6" />
        <ProveedoresList proveedores={proveedores} />
      </div>
    </main>
  );
}
