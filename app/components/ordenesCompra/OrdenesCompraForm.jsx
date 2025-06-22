"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2 } from "lucide-react";
import Swal from 'sweetalert2';

export default function OrdenesCompraForm({ proveedores, articulos, onSuccess }) {
  const [codProveedor, setCodProveedor] = useState("");
  const [detalleOC, setDetalleOC] = useState([]);
  const [codArticulo, setCodArticulo] = useState("");
  const [cantidadDOC, setCantidadDOC] = useState("");
  const [articulosProveedor, setArticulosProveedor] = useState([]);
  const [precioActual, setPrecioActual] = useState(null);
  const [proveedorSugerido, setProveedorSugerido] = useState(null);
  const [cantidadError, setCantidadError] = useState("");

  // Actualizar proveedor sugerido y lote cuando cambia el artículo
  useEffect(() => {
    if (codArticulo) {
      const articulo = articulos.find(a => a.codArticulo === parseInt(codArticulo));
      if (articulo) {
        setCodProveedor(articulo.codProveedorPredeterminado?.toString() ?? "");

        const cantidadSugerida =
          articulo.modeloInventarioLoteFijo?.tamanoLoteFijo ??
          articulo.modeloInventarioIntervaloFijo?.cantidadIntervaloFijo ??
          articulo.modeloCantidadEconomica?.cantidadEconomicaPedido;
        console.log("Cantidad sugerida:", cantidadSugerida);
        if (typeof cantidadSugerida === "number" && cantidadSugerida > 0) {
          setCantidadDOC(cantidadSugerida.toString());
        } else {
          setCantidadDOC("");
        }
      }
    }
  }, [codArticulo]);

  // Cargar artículos del proveedor seleccionado
  useEffect(() => {
    if (codProveedor) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor-articulos/proveedor/${codProveedor}`)
        .then(res => res.json())
        .then(data => setArticulosProveedor(data.map(r => ({
          codArticulo: r.articulo.codArticulo,
          nombreArt: r.articulo.nombreArt,
          precioUnitarioAP: r.precioUnitarioAP ?? r.costoUnitarioAP ?? 0
        }))));
    } else {
      setArticulosProveedor([]);
    }
    setPrecioActual(null);
  }, [codProveedor]);

  // Actualizar precio cuando cambia el artículo o artículos del proveedor
  useEffect(() => {
    if (codArticulo) {
      const art = articulosProveedor.find(a => a.codArticulo === parseInt(codArticulo));
      setPrecioActual(art ? art.precioUnitarioAP : null);
    } else {
      setPrecioActual(null);
    }
  }, [codArticulo, articulosProveedor]);

  const agregarArticulo = () => {
    if (!codArticulo || !cantidadDOC) return;
    if (Number(cantidadDOC) < 1) {
      setCantidadError("La cantidad debe ser mayor o igual a 1");
      return;
    }
    setCantidadError("");
    const articulo = articulos.find(a => a.codArticulo === parseInt(codArticulo));
    const articuloProveedor = articulosProveedor.find(a => a.codArticulo === parseInt(codArticulo));
    if (!articulo || !articuloProveedor || typeof articuloProveedor.precioUnitarioAP !== "number") {
      alert("Error: no se pudo obtener el precio del artículo.");
      return;
    }
    setDetalleOC(prev => [
      ...prev,
      {
        codArticulo: articulo.codArticulo,
        nombreArt: articulo.nombreArt,
        cantidadDOC: parseInt(cantidadDOC),
        montoDOC: articuloProveedor.precioUnitarioAP * parseInt(cantidadDOC),
      }
    ]);
    setCodArticulo("");
    setCantidadDOC("");
    setPrecioActual(null);
  };

  const eliminarArticulo = (codArticulo) => {
    setDetalleOC(prev => prev.filter(a => a.codArticulo !== codArticulo));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!codProveedor) {
      Swal.fire("Falta proveedor", "Selecciona un proveedor.", "warning");
      return;
    }
    if (detalleOC.length === 0) {
      Swal.fire("Sin artículos", "Agrega al menos un artículo a la orden.", "warning");
      return;
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codProveedor: parseInt(codProveedor),
        detalleOC: detalleOC.map((a) => ({
          codArticulo: a.codArticulo,
          cantidadDOC: a.cantidadDOC,
        })),
      }),
    });
    const data = await res.json();
    if (res.ok && data.requiereConfirmacion) {
      const confirmar = await Swal.fire({
        icon: "warning",
        title: "Confirmar creación",
        text: data.mensaje,
        showCancelButton: true,
        confirmButtonText: "Sí, continuar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#16a34a",
        cancelButtonColor: "#dc2626"
      });

      if (!confirmar.isConfirmed) return;

      // Enviamos nuevamente pero con un flag explícito de confirmación
      const reintento = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codProveedor: parseInt(codProveedor),
          detalleOC: detalleOC.map((a) => ({
            codArticulo: a.codArticulo,
            cantidadDOC: a.cantidadDOC,
          })),
          confirmarConflicto: true  // este nuevo flag lo podés capturar opcionalmente en el backend
        }),
      });

      if (reintento.ok) {
        setCodProveedor("");
        setDetalleOC([]);
        onSuccess?.();
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Orden de compra registrada correctamente.",
          confirmButtonColor: "#16a34a",
        });
      } else {
        const err = await reintento.json();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.error || "No se pudo registrar la orden.",
          confirmButtonColor: "#dc2626",
        });
      }

    } else if (res.ok) {
      // Caso normal sin conflicto
      setCodProveedor("");
      setDetalleOC([]);
      onSuccess?.();
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Orden de compra registrada correctamente.",
        confirmButtonColor: "#16a34a",
      });
    } else {
      const error = await res.json();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.error || "No se pudo registrar la orden.",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-12 gap-2">
        <select
          value={codArticulo}
          onChange={e => setCodArticulo(e.target.value)}
          className="col-span-6 border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccione un artículo</option>
          {articulos.map(a => (
            <option key={a.codArticulo} value={a.codArticulo}>
              {a.nombreArt}
            </option>
          ))}
        </select>

        <select
          value={codProveedor}
          onChange={e => setCodProveedor(e.target.value)}
          className="col-span-3 border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccione un proveedor</option>
          {proveedores.map(p => (
            <option key={p.codProveedor} value={p.codProveedor}>
              {p.nombreProveedor}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          placeholder="Cantidad"
          value={cantidadDOC}
          onChange={e => {
            setCantidadDOC(e.target.value);
            setCantidadError("");
          }}
          className="col-span-3 border border-gray-300 rounded px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {precioActual !== null && cantidadDOC ? (
        <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
          <span>Precio: ${precioActual} | Monto: ${Number(precioActual) * Number(cantidadDOC)}</span>
        </div>
      ) : null}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={agregarArticulo}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 cursor-pointer rounded flex items-center justify-center gap-1"
        >
          <Plus className="w-4 h-4" /> Añadir
        </button>
      </div>

      {cantidadError && (
        <div className="text-red-600 text-xs mt-1">{cantidadError}</div>
      )}

      <ul className="space-y-2">
        {detalleOC.map(a => (
          <li
            key={a.codArticulo}
            className="flex justify-between items-center border rounded px-4 py-2 bg-gray-50"
          >
            <div className="flex-1">
              <span className="text-gray-800 font-medium">{a.nombreArt} - Cantidad: {a.cantidadDOC} - Monto: ${a.montoDOC}</span>
            </div>
            <button
              type="button"
              onClick={() => eliminarArticulo(a.codArticulo)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold w-full cursor-pointer"
      >
        Registrar Orden de Compra
      </button>
    </form>
  );
}
