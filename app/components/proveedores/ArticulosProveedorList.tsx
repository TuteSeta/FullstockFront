'use client';

import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';

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

    return (
        <div className="mt-4">
            <h3 className="font-semibold mb-2">Artículos ofrecidos:</h3>
            {articulos.length > 0 ? (
                <ul className="text-sm text-gray-700 space-y-4">
                    {articulos.map((rel) => (
                        <li key={rel.codArticulo} className="flex justify-between items-start border-b pb-2">
                            <div className="flex-1">
                                <p className="font-medium">{rel.articulo.nombreArt}</p>
                                <p className="text-gray-600 text-xs">{rel.articulo.descripcion}</p>

                                <div className="mt-2 space-y-1">
                                    {(['precioUnitarioAP', 'cargoPedidoAP', 'demoraEntregaAP'] as const).map((key) => (
                                        <div key={key}>
                                            <strong>
                                                {key === 'precioUnitarioAP' && 'Precio:'}
                                                {key === 'cargoPedidoAP' && 'Cargo de pedido:'}
                                                {key === 'demoraEntregaAP' && 'Demora de entrega (días):'}
                                            </strong>{' '}
                                            {editandoId === rel.codArticulo ? (
                                                <input
                                                    type="number"
                                                    value={
                                                        (formData[key] !== undefined ? String(formData[key]) : '') as string | number
                                                    }
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            [key]: parseFloat(e.target.value),
                                                        })
                                                    }
                                                    className="mt-1 border rounded px-2 py-1 text-sm w-32"
                                                />
                                            ) : (
                                                <span>
                                                    {key === 'demoraEntregaAP'
                                                        ? rel.demoraEntregaAP + ' días'
                                                        : `$${rel[key]}`}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="flex flex-col gap-2 items-center justify-start ml-4">
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
                                    <button
                                        onClick={() => comenzarEdicion(rel)}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="Editar"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                )}

                                <button
                                    onClick={() => {
                                        fetch(
                                            `${process.env.NEXT_PUBLIC_API_URL}/proveedor-articulos/${proveedorId}/${rel.codArticulo}`,
                                            { method: 'DELETE' }
                                        )
                                            .then(() => onDelete())
                                            .catch(() => alert('Error al eliminar artículo del proveedor'));
                                    }}
                                    className="text-red-600 hover:text-red-800"
                                    title="Eliminar"
                                >
                                    ✕
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500">No hay artículos registrados.</p>
            )}
        </div>
    );
}
