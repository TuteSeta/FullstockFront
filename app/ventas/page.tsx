"use client"; // Añade esto si el archivo no lo tiene

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
    <div className="space-y-8 bg-white min-h-screen p-6">
     <BackButton label="Volver" />
      <div>
        <h1 className="text-2xl font-semibold text-black">Registrar Venta</h1>
        <VentaForm articulos={articulos} onSuccess={handleVentaSuccess} />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-black">Ventas Registradas</h2>
        <VentasList ventas={ventas}  onSuccess={handleVentaSuccess}/>
      </div>
    </div>
  );
}