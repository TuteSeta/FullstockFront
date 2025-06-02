'use client';

import { useState } from 'react';
import { Pencil, Check, X, Trash2 } from 'lucide-react';

type ArticuloProveedor = {
  codArticulo: number;
  articulo: {
    nombreArt: string;
    descripcion: string;
  };
  precioUnitarioAP: number;
  cargoPedidoAP: number;
  demoraEntregaAP: number;
};

type Props = {
  proveedorId: number;
  articulos: ArticuloProveedor[];
  onDelete: () => void;
};

export default function ArticulosProveedorList({ proveedorId, articulos, onDelete }: Props) {
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<ArticuloProveedor>>({});

  const comenzarEdicion = (art: ArticuloProveedor) => {
    setEditandoId(art.codArticulo);
    setFormData({
      precioUnitarioAP: art.precioUnitarioAP,
      cargoPedidoAP: art.cargoPedidoAP,
      demoraEntregaAP: art.demoraEntregaAP,
    });
  };

  const guardarCambios = async (codArticulo: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor-articulos/${proveedorId}/${codArticulo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setEditandoId(null);
      setFormData({});
      await onDelete();
    } catch {
      alert('Error al actualizar los datos');
    }
  };

  const eliminarArticuloProveedor = async (codArticulo: number) => {
    const confirmar = window.confirm('¿Estás seguro de que querés eliminar este artículo del proveedor?');
    if (!confirmar) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor-articulos/${proveedorId}/${codArticulo}`, {
        method: 'DELETE',
      });
      await onDelete();
    } catch {
      alert('Error al eliminar el artículo del proveedor');
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Productos que ofrece</h3>

      {articulos.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 text-sm">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Artículo</th>
                <th className="px-4 py-2 text-left">Precio de compra</th>
                <th className="px-4 py-2 text-left">Cargo pedido</th>
                <th className="px-4 py-2 text-left">Demora entrega (días)</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {articulos.map((rel) => (
                <tr key={rel.codArticulo} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2">{rel.articulo.nombreArt}</td>

                  <td className="px-4 py-2">
                    {editandoId === rel.codArticulo ? (
                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-24"
                        value={formData.precioUnitarioAP ?? ''}
                        onChange={(e) =>
                          setFormData({ ...formData, precioUnitarioAP: parseFloat(e.target.value) })
                        }
                      />
                    ) : (
                      `$${rel.precioUnitarioAP.toFixed(2)}`
                    )}
                  </td>

                  <td className="px-4 py-2">
                    {editandoId === rel.codArticulo ? (
                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-24"
                        value={formData.cargoPedidoAP ?? ''}
                        onChange={(e) =>
                          setFormData({ ...formData, cargoPedidoAP: parseFloat(e.target.value) })
                        }
                      />
                    ) : (
                      `$${rel.cargoPedidoAP.toFixed(2)}`
                    )}
                  </td>

                  <td className="px-4 py-2">
                    {editandoId === rel.codArticulo ? (
                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-24"
                        value={formData.demoraEntregaAP ?? ''}
                        onChange={(e) =>
                          setFormData({ ...formData, demoraEntregaAP: parseInt(e.target.value) })
                        }
                      />
                    ) : (
                      `${rel.demoraEntregaAP} días`
                    )}
                  </td>

                  <td className="px-4 py-2 space-x-2 flex">
                    {editandoId === rel.codArticulo ? (
                      <>
                        <button
                          onClick={() => guardarCambios(rel.codArticulo)}
                          className="text-green-600 hover:text-green-800"
                          title="Guardar"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditandoId(null);
                            setFormData({});
                          }}
                          className="text-gray-600 hover:text-gray-800"
                          title="Cancelar"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => comenzarEdicion(rel)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => eliminarArticuloProveedor(rel.codArticulo)}
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No hay artículos registrados.</p>
      )}
    </div>
  );
}
