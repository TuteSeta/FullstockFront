'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

type Articulo = {
  codArticulo: number;
  nombreArt: string;
};

type Props = {
  proveedorId: number;
  articulosAsignados: number[];
  onSuccess: () => void;
};

// Helper para limpiar nulls (solo primer nivel)
function cleanNulls(obj: any) {
  const cleaned: any = {};
  for (const key in obj) {
    if (obj[key] !== null) cleaned[key] = obj[key];
  }
  return cleaned;
}

export default function ArticuloProveedorForm({ proveedorId, articulosAsignados, onSuccess }: Props) {
  const [articulosDisponibles, setArticulosDisponibles] = useState<Articulo[]>([]);
  const [formData, setFormData] = useState({
    codArticulo: '',
    costoUnitarioAP: '',
    cargoPedidoAP: '',
    demoraEntregaAP: '',
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos`)
      .then(res => res.json())
      .then(setArticulosDisponibles);
  }, []);

  const articulosFiltrados = articulosDisponibles.filter(
    (a) => !articulosAsignados.includes(a.codArticulo)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const codArticuloNum = Number(formData.codArticulo);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor-articulos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        codProveedor: proveedorId,
        codArticulo: codArticuloNum,
        costoUnitarioAP: Number(formData.costoUnitarioAP),
        cargoPedidoAP: Number(formData.cargoPedidoAP),
        demoraEntregaAP: Number(formData.demoraEntregaAP),
      }),
    });

    if (res.ok) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const articuloRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos/${codArticuloNum}`);
      if (!articuloRes.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo obtener el artículo para recalcular el modelo.',
          confirmButtonColor: '#d33',
        });
        return;
      }
      const articulo = await articuloRes.json();

      const bodyPut = cleanNulls({
        nombreArt: articulo.nombreArt,
        descripcion: articulo.descripcion,
        demanda: articulo.demanda,
        precioArticulo: articulo.precioArticulo,
        cantArticulo: articulo.cantArticulo,
        costoMantenimiento: articulo.costoMantenimiento,
        desviacionDemandaLArticulo: articulo.desviacionDemandaLArticulo,
        desviacionDemandaTArticulo: articulo.desviacionDemandaTArticulo,
        nivelServicioDeseado: articulo.nivelServicioDeseado,
        modeloInventarioLoteFijo: articulo.modeloInventarioLoteFijo,
        modeloInventarioIntervaloFijo: articulo.modeloInventarioIntervaloFijo,
        codProveedorPredeterminado: proveedorId,
        recalcularLoteFijo: true
      });

      const putRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos/${codArticuloNum}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPut),
      });

      if (!putRes.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo recalcular el modelo de lote fijo.',
          confirmButtonColor: '#d33',
        });
        return;
      }

      setFormData({ codArticulo: '', costoUnitarioAP: '', cargoPedidoAP: '', demoraEntregaAP: '' });
      onSuccess();
      Swal.fire({
        icon: 'success',
        title: 'Artículo asignado',
        text: 'El artículo fue asignado correctamente al proveedor.',
        confirmButtonColor: '#3085d6',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error al asignar artículo',
        text: 'Verificá los datos o intentá nuevamente.',
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6" onClick={(e) => e.stopPropagation()}>
      <h3 className="text-sm font-semibold mb-2">Asignar nuevo artículo</h3>

      {/* MOBILE */}
      <div className="md:hidden bg-white p-4 rounded shadow space-y-3 text-sm">
        <div>
          <label className="block font-medium mb-1">Artículo</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={formData.codArticulo}
            onChange={(e) => setFormData({ ...formData, codArticulo: e.target.value })}
            required
          >
            <option value="">Seleccionar</option>
            {articulosFiltrados.map((articulo) => (
              <option key={articulo.codArticulo} value={articulo.codArticulo}>
                {articulo.nombreArt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Precio de compra</label>
          <input
            type="number"
            min={0}
            className="w-full border rounded px-2 py-1"
            value={formData.costoUnitarioAP}
            onChange={(e) => setFormData({ ...formData, costoUnitarioAP: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Cargo pedido</label>
          <input
            type="number"
            min={0}
            className="w-full border rounded px-2 py-1"
            value={formData.cargoPedidoAP}
            onChange={(e) => setFormData({ ...formData, cargoPedidoAP: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Demora entrega (días)</label>
          <input
            type="number"
            min={0}
            className="w-full border rounded px-2 py-1"
            value={formData.demoraEntregaAP}
            onChange={(e) => setFormData({ ...formData, demoraEntregaAP: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Confirmar
        </button>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-sm">
          <thead className="bg-blue-100 text-gray-800">
            <tr>
              <th className="px-4 py-2 text-left">Artículo</th>
              <th className="px-4 py-2 text-left">Precio de compra</th>
              <th className="px-4 py-2 text-left">Cargo pedido</th>
              <th className="px-4 py-2 text-left">Demora entrega (días)</th>
              <th className="px-4 py-2 text-left">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-200">
              <td className="px-4 py-2">
                <select
                  className="w-full border rounded px-2 py-1"
                  value={formData.codArticulo}
                  onChange={(e) => setFormData({ ...formData, codArticulo: e.target.value })}
                  required
                >
                  <option value="">Seleccionar</option>
                  {articulosFiltrados.map((articulo) => (
                    <option key={articulo.codArticulo} value={articulo.codArticulo}>
                      {articulo.nombreArt}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  min={0}
                  className="w-24 border rounded px-2 py-1"
                  value={formData.costoUnitarioAP}
                  onChange={(e) => setFormData({ ...formData, costoUnitarioAP: e.target.value })}
                  required
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  min={0}
                  className="w-24 border rounded px-2 py-1"
                  value={formData.cargoPedidoAP}
                  onChange={(e) => setFormData({ ...formData, cargoPedidoAP: e.target.value })}
                  required
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  min={0}
                  className="w-24 border rounded px-2 py-1"
                  value={formData.demoraEntregaAP}
                  onChange={(e) => setFormData({ ...formData, demoraEntregaAP: e.target.value })}
                  required
                />
              </td>
              <td className="px-4 py-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
                >
                  Confirmar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </form>
  );
}
