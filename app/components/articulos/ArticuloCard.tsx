'use client';
import { Pencil, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

type Articulo = {
    codArticulo: number;
    nombreArt: string;
    descripcion: string;
    demanda?: number;
    cantArticulo?: number;
    cantMaxArticulo?: number;
    costoAlmacenamiento?: number;
    costoMantenimiento?: number;
    costoPedido?: number;
    costoCompra?: number;
    desviacionDemandaLArticulo?: number;
    desviacionDemandaTArticulo?: number;
    nivelServicioDeseado?: number;
};

export default function ArticuloCard({ articulo }: { articulo: Articulo }) {
    const [expandido, setExpandido] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [formData, setFormData] = useState({ ...articulo });

    return (
        <>
            {/* Card simple */}
            <div
                onClick={() => setExpandido(true)}
                className="cursor-pointer bg-white shadow rounded-lg p-4 transition-all duration-300 hover:scale-[1.01]"
            >
                <h2 className="text-xl font-semibold text-gray-900">{articulo.nombreArt}</h2>
                <p className="text-sm text-gray-700 mt-2 truncate">{articulo.descripcion}</p>
            </div>

            {/* Modal expandido */}
            <AnimatePresence>
                {expandido && (
                    <>
                        {/* Fondo desenfocado */}
                        <motion.div
                            className="fixed inset-0 z-40 bg-white/10 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setExpandido(false)}
                        />

                        {/* Contenido expandido */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.25 }}
                            className="fixed inset-0 z-50 flex items-center justify-center"
                        >
                            <motion.div
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full text-gray-800 relative"
                            >
                                {/* Botón de cierre */}
                                <button
                                    onClick={() => setExpandido(false)}
                                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center transition hover:bg-gray-200"
                                    title="Cerrar"
                                >
                                    ×
                                </button>
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">{articulo.nombreArt}</h2>
                                <p className="text-sm text-gray-500 mb-4">Código: {articulo.codArticulo}</p>
                                <p className="mb-4 text-gray-700">{articulo.descripcion}</p>
                                <div className="flex gap-3 mb-4">
                                    <button
                                        onClick={() => setModoEdicion(!modoEdicion)}
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                                        title="Editar"
                                    >
                                        <Pencil className="w-5 h-5" />
                                        <span className="text-sm">Editar</span>
                                    </button>

                                    <button
                                        onClick={async () => {
                                            const confirm = window.confirm("¿Seguro que querés eliminar este artículo?");
                                            if (confirm) {
                                                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos/${articulo.codArticulo}`, {
                                                    method: 'DELETE',
                                                });
                                                setExpandido(false);
                                                window.location.reload();
                                            }
                                        }}
                                        className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                        <span className="text-sm">Eliminar</span>
                                    </button>
                                </div>



                                {/* Detalles extendidos */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                                    {[
                                        ['demanda', 'Demanda'],
                                        ['cantArticulo', 'Cantidad actual'],
                                        ['cantMaxArticulo', 'Cantidad máxima'],
                                        ['costoAlmacenamiento', 'Costo almacenamiento'],
                                        ['costoMantenimiento', 'Costo mantenimiento'],
                                        ['costoPedido', 'Costo pedido'],
                                        ['costoCompra', 'Costo compra'],
                                        ['desviacionDemandaLArticulo', 'Desv. demanda L'],
                                        ['desviacionDemandaTArticulo', 'Desv. demanda T'],
                                        ['nivelServicioDeseado', 'Nivel servicio deseado'],
                                    ].map(([key, label]) =>
                                        formData[key as keyof Articulo] !== undefined ? (
                                            <div key={key}>
                                                <strong>{label}:</strong>{' '}
                                                {modoEdicion ? (
                                                    <input
                                                        type="number"
                                                        value={formData[key as keyof Articulo] ?? ''}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, [key]: parseFloat(e.target.value) || 0 })
                                                        }
                                                        className="mt-1 w-full border border-gray-300 rounded px-2 py-1 text-gray-900"
                                                    />
                                                ) : (
                                                    <span>{formData[key as keyof Articulo]}</span>
                                                )}
                                            </div>
                                        ) : null
                                    )}
                                    {modoEdicion && (
                                        <button
                                            onClick={async () => {
                                                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos/${articulo.codArticulo}`, {
                                                    method: 'PUT',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify(formData),
                                                });
                                                setModoEdicion(false);

                                            }}
                                            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                                        >
                                            Guardar cambios
                                        </button>
                                    )}
                                </div>

                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
