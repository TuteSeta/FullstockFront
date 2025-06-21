"use client";

import { useState, useEffect } from "react";
import VentaForm from "@/app/components/ventas/VentaForm";
import VentasList from "@/app/components/ventas/VentaList";
import Pagination from "@/app/ventas/Pagination";
import BackButton from "../components/BackButton";

async function obtenerArticulos() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos`, {
    cache: "no-store",
  });
  return res.json();
}

async function obtenerVentas() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ventas`, {
    cache: "no-store",
  });
  return res.json();
}

export default function VentasPage() {
  const [articulos, setArticulos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    async function fetchData() {
      const [articulosData, ventasData] = await Promise.all([
        obtenerArticulos(),
        obtenerVentas(),
      ]);
      setArticulos(articulosData);
      setVentas(ventasData);
    }
    fetchData();
  }, []);

  const handleVentaSuccess = async () => {
    const [updatedArticulos, updatedVentas] = await Promise.all([
      obtenerArticulos(),
      obtenerVentas(),
    ]);
    setArticulos(updatedArticulos);
    setVentas(updatedVentas);
    // Resetear a la primera página cuando se agrega una nueva venta
    setCurrentPage(1);
  };

  // Calcular ventas para la página actual
  const indexOfLastVenta = currentPage * itemsPerPage;
  const indexOfFirstVenta = indexOfLastVenta - itemsPerPage;
  const currentVentas = ventas.slice(indexOfFirstVenta, indexOfLastVenta);
  const totalPages = Math.ceil(ventas.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Resetear a la primera página
  };

  return (
    <div className="bg-gray-50 min-h-screen px-9 py-5">
      <BackButton label="Volver" />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Registrar Venta</h1>
          <VentaForm articulos={articulos} onSuccess={handleVentaSuccess} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Ventas Registradas</h2>
            <div className="flex items-center gap-2">
              <label htmlFor="itemsPerPage" className="text-sm text-gray-800">
                Mostrar:
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
          
              </select>
            </div>
          </div>
          <VentasList ventas={currentVentas} onSuccess={handleVentaSuccess} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={ventas.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>
    </div>
  );
}