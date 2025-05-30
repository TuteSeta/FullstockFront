"use client";

export default function VentasList({ ventas }) {
  if (!ventas.length) {
    return <p className="text-gray-500">No hay ventas registradas.</p>;
  }

  return (
    <div className="grid gap-4">
      {ventas.map((venta) => (
        <div
          key={venta.nroVenta}
          className="border border-gray-200 rounded p-4 shadow-sm bg-gray-50"
        >
          <h3 className="font-semibold text-green-700">
            Venta #{venta.nroVenta} - Artículo: ({venta.articulo?.nombreArt}) - Código: ({venta.articulo?.codArticulo}) - 
            Fecha: ({new Date(venta.fechaVenta).toLocaleDateString()}) - Monto: (${venta.montoTotalVenta})
          </h3>
          <p className="text-sm text-gray-700">
            Cantidad vendida: {venta.cantidad}
          </p>
        </div>
      ))}
    </div>
  );
}
