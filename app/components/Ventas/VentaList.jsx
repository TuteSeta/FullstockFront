  "use client";

  export default function VentasList({ ventas }) {
    if (!ventas.length) {
      return <p className="text-gray-500">No hay ventas registradas.</p>;
    }

    return (
      <div className="grid gap-4">
        {ventas.map((venta) => (
          <div key={venta.nroVenta} className="border border-gray-200 rounded p-4 shadow-sm bg-gray-50">
            <h3 className="font-semibold text-green-700">
              #{venta.nroVenta} - {new Date(venta.fechaVenta).toLocaleDateString()} (${venta.montoTotalVenta})
            </h3>
            <p className="text-sm text-gray-700">
              Artículos vendidos: {venta.detalleVenta?.length || 0}
            </p>
          </div>
        ))}
      </div>
    );
  }
