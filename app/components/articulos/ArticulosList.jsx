export default function ArticuloList({ articulos }) {
  if (!articulos.length) {
    return <p className="text-gray-500">No hay artículos cargados.</p>;
  }

  return (
    <div className="grid gap-4">
      {articulos.map((a) => (
        <div key={a.id} className="border border-gray-200 rounded p-4 shadow-sm bg-gray-50">
          <h3 className="font-semibold text-blue-700">{a.codigo} - {a.descripcion}</h3>
          <p className="text-sm text-gray-700">Demanda: {a.demanda}</p>
        </div>
      ))}
    </div>
  );
}