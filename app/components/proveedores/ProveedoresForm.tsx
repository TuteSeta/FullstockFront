'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

type Props = {
  onSuccess: () => void;
};

type Articulo = {
  codArticulo: number;
  nombreArt: string;
};

export default function ProveedoresForm({ onSuccess }: Props) {
  const [nombre, setNombre] = useState('');
  const [articulos, setArticulos] = useState<Articulo[]>([]);

  const [formArticulo, setFormArticulo] = useState({
    codArticulo: '',
    costoUnitarioAP: '',
    cargoPedidoAP: '',
    demoraEntregaAP: '',
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos`)
      .then((res) => res.json())
      .then(setArticulos);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones simples
    if (!formArticulo.codArticulo || !formArticulo.costoUnitarioAP || !formArticulo.cargoPedidoAP || !formArticulo.demoraEntregaAP) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Debés completar todos los datos del artículo.',
        confirmButtonColor: '#d33',
      });
      return;
    }

    // 1. Crear proveedor
    const proveedorRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombreProveedor: nombre }),
    });

    if (!proveedorRes.ok) {
      Swal.fire({
        icon: 'error',
        title: 'Error al crear proveedor',
        text: 'Verificá los datos e intentá nuevamente.',
        confirmButtonColor: '#d33',
      });
      return;
    }

    const proveedor = await proveedorRes.json();
    const codProveedor = proveedor.codProveedor;

    // 2. Crear relación proveedor-artículo
    const articuloRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor-articulos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        codProveedor,
        codArticulo: Number(formArticulo.codArticulo),
        costoUnitarioAP: Number(formArticulo.costoUnitarioAP),
        cargoPedidoAP: Number(formArticulo.cargoPedidoAP),
        demoraEntregaAP: Number(formArticulo.demoraEntregaAP),
      }),
    });

    if (!articuloRes.ok) {
      Swal.fire({
        icon: 'error',
        title: 'Error al asociar artículo',
        text: 'Se creó el proveedor pero no se pudo asociar el artículo.',
        confirmButtonColor: '#d33',
      });
      return;
    }

    setNombre('');
    setFormArticulo({
      codArticulo: '',
      costoUnitarioAP: '',
      cargoPedidoAP: '',
      demoraEntregaAP: '',
    });
    onSuccess();

    Swal.fire({
      icon: 'success',
      title: 'Proveedor creado',
      text: `Proveedor "${nombre}" y artículo asociado correctamente.`,
      confirmButtonColor: '#3085d6',
    });
  };

  return (
    <div className="mt-1">
      {/* Título centrado */}
      <div className="flex justify-center px-5 pb-5">
        <h1 className="text-2xl font-bold text-center">Agregar Proveedor</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <hr className="col-span-full border-t my-4" />

        <h3 className="text-md font-semibold col-span-full">Artículo provisto</h3>

        <select
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 col-span-full"
          value={formArticulo.codArticulo}
          onChange={(e) => setFormArticulo({ ...formArticulo, codArticulo: e.target.value })}
          required
        >
          <option value="">Seleccionar artículo</option>
          {articulos.map((articulo) => (
            <option key={articulo.codArticulo} value={articulo.codArticulo}>
              {articulo.nombreArt}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Precio unitario"
          value={formArticulo.costoUnitarioAP}
          onChange={(e) => setFormArticulo({ ...formArticulo, costoUnitarioAP: e.target.value })}
          required
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="number"
          placeholder="Cargo pedido"
          value={formArticulo.cargoPedidoAP}
          onChange={(e) => setFormArticulo({ ...formArticulo, cargoPedidoAP: e.target.value })}
          required
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="number"
          placeholder="Demora entrega (días)"
          value={formArticulo.demoraEntregaAP}
          onChange={(e) => setFormArticulo({ ...formArticulo, demoraEntregaAP: e.target.value })}
          required
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="col-span-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Confirmar proveedor + artículo
        </button>
      </form>
    </div>
  );

}
