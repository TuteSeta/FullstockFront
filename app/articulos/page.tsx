"use client"
import { useState, useEffect } from 'react';
import ArticuloForm from '../components/articulos/ArticulosForm';
import ArticuloList from '../components/articulos/ArticulosList';
import { Package } from 'lucide-react';

export default function ArticulosPage() {
    const [articulos, setArticulos] = useState([]);

    const fetchArticulos = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos`);
        const data = await res.json();
        setArticulos(data);
    };

    useEffect(() => {
        fetchArticulos();
    }, []);

    return (
        <main className="min-h-screen bg-gray-100 text-gray-800 p-8">
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
                <div className='flex items-center mb-4'>
                    <Package className="w-7 h-7 text-blue-600" />
                    <h1 className="text-3xl font-bold ml-2">Gestion de articulos</h1>
                </div>
                <ArticuloForm onSuccess={fetchArticulos} />
                <hr className="my-6" />
                <ArticuloList articulos={articulos} />
            </div>
        </main>
    );
}