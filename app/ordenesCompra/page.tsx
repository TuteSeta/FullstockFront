"use client";

import { useState, useEffect } from "react";
import OrdenesCompraForm from "@/app/components/ordenesCompra/OrdenesCompraForm";
import OrdenesCompraList from "@/app/components/ordenesCompra/OrdenesCompraList";
import BackButton from "../components/BackButton";

async function obtenerProveedores() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedores`, {
    cache: "no-store",
  });
  return res.json();
}

async function obtenerArticulos() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos`, {
    cache: "no-store",
  });
  return res.json();
}

async function obtenerOrdenesCompra() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenes`, {
    cache: "no-store",
  });
  return res.json();
}

export default function OrdenesCompraPage() {
  const [proveedores, setProveedores] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [ordenes, setOrdenes] = useState([]);

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
        <h2 className="text-xl font-semibold text-black">Órdenes de Compra Registradas</h2>
        <OrdenesCompraList ordenes={ordenes} onSuccess={handleOrdenSuccess} />
      </div>
    </div>
  );
}