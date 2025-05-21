"use client";

export default function ProveedoresList({ proveedores }) {
  if (!proveedores.length) {
    return <p className="text-gray-500">No hay proveedores cargados.</p>;
  }

  return (
    <div className="grid gap-4">
      {proveedores.map((p) => (
        <div key={p.codProveedor} className="border border-gray-200 rounded p-4 shadow-sm bg-gray-50">
          <h3 className="font-semibold text-blue-700">#{p.codProveedor} - {p.nombreProveedor}</h3>
        </div>
      ))}
    </div>
  );
}
