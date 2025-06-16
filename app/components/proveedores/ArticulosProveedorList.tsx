'use client';

import { useState } from 'react';
import { Pencil, Check, X, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

type ArticuloProveedor = {
  codArticulo: number;
  articulo: {
    nombreArt: string;
    descripcion: string;
  };
  costoUnitarioAP: number;
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
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 4;

  const inicio = (paginaActual - 1) * itemsPorPagina;
  const articulosPagina = articulos.slice(inicio, inicio + itemsPorPagina);
  const totalPaginas = Math.ceil(articulos.length / itemsPorPagina);

  const comenzarEdicion = (art: ArticuloProveedor) => {
    setEditandoId(art.codArticulo);
    setFormData({
      costoUnitarioAP: art.costoUnitarioAP,
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
    const confirmar = await Swal.fire({
      title: '¿Eliminar artículo?',
      text: 'Esta acción eliminará la asociación con el proveedor.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
    });

    if (!confirmar.isConfirmed) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor-articulos/${proveedorId}/${codArticulo}`, {
        method: 'DELETE',
      });
      await onDelete();
      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El artículo fue desvinculado correctamente.',
        confirmButtonColor: '#3085d6',
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error al eliminar',
        text: 'Ocurrió un error. Intenta nuevamente.',
        confirmButtonColor: '#d33',
      });
    }
  };


  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Productos que ofrece</h3>

      {/* Vista mobile en formato card */}
      <div className="md:hidden space-y-4">
        {articulosPagina.map((rel) => (
          <div key={rel.codArticulo} className="bg-white shadow rounded-lg p-4 space-y-2 text-sm">
            <p><strong>Artículo:</strong> {rel.articulo.nombreArt}</p>
            <p><strong>Precio de compra:</strong> ${rel.costoUnitarioAP.toFixed(2)}</p>
            <p><strong>Cargo pedido:</strong> ${rel.cargoPedidoAP.toFixed(2)}</p>
            <p><strong>Demora entrega:</strong> {rel.demoraEntregaAP} días</p>
            <div className="flex gap-2">
              <button
                onClick={() => comenzarEdicion(rel)}
                className="flex-1 bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
              >
                Editar
              </button>
              <button
                onClick={() => eliminarArticuloProveedor(rel.codArticulo)}
                className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Vista desktop tipo tabla */}
      {articulos.length > 0 ? (
        <div className="hidden md:block overflow-x-auto">
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
              {articulosPagina.map((rel) => (
                <tr key={rel.codArticulo} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2">{rel.articulo.nombreArt}</td>
                  <td className="px-4 py-2">
                    {editandoId === rel.codArticulo ? (
                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-24"
                        value={formData.costoUnitarioAP ?? ''}
                        onChange={(e) =>
                          setFormData({ ...formData, costoUnitarioAP: parseFloat(e.target.value) })
                        }
                      />
                    ) : (
                      `$${rel.costoUnitarioAP.toFixed(2)}`
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

      {/* Paginación común */}
      {articulos.length > 0 && (
        <div className="flex justify-between items-center mt-4 px-2 text-sm">
          <button
            onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
            disabled={paginaActual === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Anterior
          </button>
          <span>Página {paginaActual} de {totalPaginas}</span>
          <button
            onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
            disabled={paginaActual === totalPaginas}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
