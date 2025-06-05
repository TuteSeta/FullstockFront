"use client";

import { useState, useEffect } from "react";
import VentaForm from "@/app/components/ventas/VentaForm";
import VentasList from "@/app/components/ventas/VentaList";
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
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <BackButton label="Volver" />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Registrar Venta</h1>
          <VentaForm articulos={articulos} onSuccess={handleVentaSuccess} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Ventas Registradas</h2>
          <VentasList ventas={ventas} onSuccess={handleVentaSuccess} />
        </div>
      </div>
    </div>
  );
}