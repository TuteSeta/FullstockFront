"use client";

import { useState, useEffect } from "react";
import OrdenesCompraForm from "@/app/components/ordenesCompra/OrdenesCompraForm";
import OrdenesCompraList from "@/app/components/ordenesCompra/OrdenesCompraList";
import BackButton from "../components/BackButton";

async function obtenerProveedores() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedores`, { cache: "no-store" });
  return res.json();
}

async function obtenerArticulos() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos`, { cache: "no-store" });
  return res.json();
}

async function obtenerOrdenesCompra() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenes`, { cache: "no-store" });
  return res.json();
}

export default function OrdenesCompraPage() {
  const [proveedores, setProveedores] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [ordenes, setOrdenes] = useState([]);

  const [page, setPage] = useState(1);
  const pageSize = 6;

  const ordenesValidas = ordenes.filter(o => o !== null && o !== undefined);
  const totalPages = Math.max(1, Math.ceil(ordenesValidas.length / pageSize));
  const ordenesPaginadas = ordenesValidas.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    async function fetchData() {
      const [proveedoresData, articulosData, ordenesData] = await Promise.all([
        obtenerProveedores(),
        obtenerArticulos(),
        obtenerOrdenesCompra(),
      ]);
      setProveedores(proveedoresData);
      setArticulos(articulosData);
      setOrdenes(ordenesData);
    }
    fetchData();
  }, []);

  const handleOrdenSuccess = async () => {
    const [updatedProveedores, updatedArticulos, updatedOrdenes] = await Promise.all([
      obtenerProveedores(),
      obtenerArticulos(),
      obtenerOrdenesCompra(),
    ]);
    setProveedores(updatedProveedores);
    setArticulos(updatedArticulos);
    setOrdenes(updatedOrdenes);
    setPage(1); // volver a primera página tras registrar orden
  };

  return (
    <div className="space-y-8 bg-white min-h-screen p-6">
      <BackButton label="Volver" />

      <div>
        <h1 className="text-2xl font-semibold text-black">Registrar Orden de Compra</h1>
        <OrdenesCompraForm
          proveedores={proveedores}
          articulos={articulos}
          onSuccess={handleOrdenSuccess}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-black mb-2">Órdenes de Compra Registradas</h2>
        <OrdenesCompraList ordenes={ordenesPaginadas} onSuccess={handleOrdenSuccess} />

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4 flex-wrap">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ← Anterior
            </button>

            <span className="text-sm text-gray-700">
              Página {page} de {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
