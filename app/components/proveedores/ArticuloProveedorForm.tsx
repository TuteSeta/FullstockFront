'use client';

import { useEffect, useState } from 'react';

type Articulo = {
  codArticulo: number;
  nombreArt: string;
};

type Props = {
  proveedorId: number;
  articulosAsignados: number[];
  onSuccess: () => void;
};

export default function ArticuloProveedorForm({ proveedorId, articulosAsignados, onSuccess }: Props) {
  const [articulosDisponibles, setArticulosDisponibles] = useState<Articulo[]>([]);
  const [formData, setFormData] = useState({
    codArticulo: '',
    precioUnitarioAP: '',
    cargoPedidoAP: '',
    demoraEntregaAP: '',
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos`)
      .then(res => res.json())
      .then(setArticulosDisponibles);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor-articulos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        codProveedor: proveedorId,
        codArticulo: Number(formData.codArticulo),
        precioUnitarioAP: Number(formData.precioUnitarioAP),
        cargoPedidoAP: Number(formData.cargoPedidoAP),
        demoraEntregaAP: Number(formData.demoraEntregaAP),
      }),
    });

    if (res.ok) {
      setFormData({ codArticulo: '', precioUnitarioAP: '', cargoPedidoAP: '', demoraEntregaAP: '' });
      onSuccess();
    } else {
      alert('Error al asignar artículo');
    }
  };

  const articulosFiltrados = articulosDisponibles.filter(
    (a) => !articulosAsignados.includes(a.codArticulo)
  );

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2 text-sm" onClick={(e) => e.stopPropagation()}>
      <select
        className="w-full border rounded px-2 py-1"
        value={formData.codArticulo}
        onChange={(e) => setFormData({ ...formData, codArticulo: e.target.value })}
        required
      >
        <option value="">Seleccionar artículo</option>
        {articulosFiltrados.map((articulo) => (
          <option key={articulo.codArticulo} value={articulo.codArticulo}>
            {articulo.nombreArt}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Precio unitario"
        className="w-full border rounded px-2 py-1"
        value={formData.precioUnitarioAP}
        onChange={(e) => setFormData({ ...formData, precioUnitarioAP: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Cargo pedido"
        className="w-full border rounded px-2 py-1"
        value={formData.cargoPedidoAP}
        onChange={(e) => setFormData({ ...formData, cargoPedidoAP: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Demora entrega"
        className="w-full border rounded px-2 py-1"
        value={formData.demoraEntregaAP}
        onChange={(e) => setFormData({ ...formData, demoraEntregaAP: e.target.value })}
        required
      />
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-1 rounded hover:bg-green-700 transition"
      >
        Confirmar
      </button>
    </form>
  );
}
