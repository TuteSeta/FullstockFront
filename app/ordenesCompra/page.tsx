"use client";

import { useState, useEffect } from "react";
import OrdenesCompraForm from "@/app/components/ordenesCompra/OrdenesCompraForm";
import OrdenesCompraList from "@/app/components/ordenesCompra/OrdenesCompraList";
import BackButton from "../components/BackButton";

type OrdenCompra = {
  nroOrdenCompra: number;
  montoOrdenCompra: number;
  fechaCreacion: string;
  estadoOrdenCompra?: {
    nombreEstadoOC: string;
  };
};

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
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);

  const [page, setPage] = useState(1);
  const pageSize = 6;

  const [ordenarPor, setOrdenarPor] = useState<'fecha' | 'monto' | 'estado'>('fecha');
  const [ascendente, setAscendente] = useState(false);
  const [mostrarCanceladas, setMostrarCanceladas] = useState(false);

  // Filtro + ordenamiento
  const ordenesFiltradas = ordenes
    .filter((o) =>
      mostrarCanceladas
        ? o.estadoOrdenCompra?.nombreEstadoOC === "Cancelada"
        : o.estadoOrdenCompra?.nombreEstadoOC !== "Cancelada"
    )
    .sort((a, b) => {
      let resultado = 0;
      if (ordenarPor === "fecha") {
        resultado = new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime();
      } else if (ordenarPor === "monto") {
        resultado = a.montoOrdenCompra - b.montoOrdenCompra;
      } else if (ordenarPor === "estado") {
        resultado = (a.estadoOrdenCompra?.nombreEstadoOC || "").localeCompare(
          b.estadoOrdenCompra?.nombreEstadoOC || ""
        );
      }
      return ascendente ? resultado : -resultado;
    });

  const totalPages = Math.max(1, Math.ceil(ordenesFiltradas.length / pageSize));
  const ordenesPaginadas = ordenesFiltradas.slice((page - 1) * pageSize, page * pageSize);

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
    setPage(1);
  };

  return (
    <div className="space-y-8 bg-white min-h-screen px-9 py-5">
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
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h2 className="text-xl font-semibold text-black">Órdenes de Compra Registradas</h2>

          <div className="flex items-center gap-2 text-black">
            <label htmlFor="ordenarPor" className="text-sm font-medium">
              Ordenar por:
            </label>
            <select
              id="ordenarPor"
              value={ordenarPor}
              onChange={(e) => setOrdenarPor(e.target.value as 'fecha' | 'monto' | 'estado')}
              className="border border-gray-300 px-2 py-1 rounded text-sm cursor-pointer"
            >
              <option value="fecha">Fecha</option>
              <option value="monto">Monto</option>
              <option value="estado">Estado</option>
            </select>

            <button
              onClick={() => setAscendente(!ascendente)}
              className="text-sm text-blue-600 cursor-pointer"
            >
              {ascendente ? "Ascendente" : "Descendente"}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <button
            onClick={() => {
              setMostrarCanceladas(!mostrarCanceladas);
              setPage(1);
            }}
            className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded hover:bg-blue-700 transition"
          >
            {mostrarCanceladas ? "Ver órdenes activas" : "Ver órdenes canceladas"}
          </button>
        </div>

        <OrdenesCompraList ordenes={ordenesPaginadas} onSuccess={handleOrdenSuccess} />

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
