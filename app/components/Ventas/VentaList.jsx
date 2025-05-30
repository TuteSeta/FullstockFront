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
            Venta #{venta.nroVenta} - Artículos:&nbsp;
            {venta.detalleVenta && venta.detalleVenta.length > 0
              ? venta.detalleVenta
                  .map((detalle) => (
                    <span key={detalle.articulo.codArticulo} className="text-blue-600">
                      {detalle.articulo.nombreArt} (Código: {detalle.articulo.codArticulo})
                    </span>
                  ))
                  .reduce((prev, curr) => [prev, ", ", curr])
              : "Sin artículos"}
            &nbsp;- Fecha: {new Date(venta.fechaVenta).toLocaleDateString()} - Monto: (${venta.montoTotalVenta})
          </h3>

          <ul className="text-sm text-gray-700">
            {venta.detalleVenta.map((detalle) => (
              <li key={detalle.articulo.codArticulo}>
                {detalle.articulo.nombreArt} - Cantidad: {detalle.cantidad} - Subtotal: ${detalle.montoDetalleVenta}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
