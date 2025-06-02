'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

type Filtros = {
    nombre?: string;
};

type Props = {
    onFiltrar: (filtros: Filtros) => void;
};

export default function ArticuloFiltro({ onFiltrar }: Props) {
    const [nombre, setNombre] = useState('');

    useEffect(() => {
        const timeout = setTimeout(() => {
            onFiltrar({ nombre: nombre.trim() || undefined });
        }, 300);
        return () => clearTimeout(timeout);
    }, [nombre]);

    return (
        <div className="w-full lg:w-96">
            <div className="relative">
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Buscar artículo..."
                    className="w-full border border-gray-300 rounded-lg py-3 pl-4 pr-12 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800"
                />
                <Search className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
            </div>
        </div>
    );
}
