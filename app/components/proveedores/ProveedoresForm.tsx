'use client';
import { useState } from 'react';
import Swal from 'sweetalert2';
type Props = {
  onSuccess: () => void;
};

export default function ProveedoresForm({ onSuccess }: Props) {
  const [nombre, setNombre] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombreProveedor: nombre }),
    });

    if (res.ok) {
      setNombre('');
      onSuccess();
      Swal.fire({
        icon: 'success',
        title: 'Proveedor creado',
        text: `"${nombre}" se creó correctamente.`,
        confirmButtonColor: '#3085d6',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error al crear proveedor',
        text: 'Verificá los datos o intentá nuevamente.',
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {/* Label visible solo en mobile */}
      <label htmlFor="nombreProveedor" className="md:hidden text-sm font-medium text-gray-700">
        Nombre del proveedor
      </label>

      <input
        id="nombreProveedor"
        type="text"
        name="nombreProveedor"
        placeholder="Nombre del proveedor"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 col-span-full"
      />

      <button
        type="submit"
        className="col-span-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Crear Proveedor
      </button>
    </form>
  );
}
