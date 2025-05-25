// Make sure the path is correct; if the file does not exist, create it at src/components/ventas/VentaForm.tsx or .jsx
import VentaForm from "@/app/components/ventas/VentaForm";
import VentasList from "@/app/components/ventas/VentaList";

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

export default async function VentasPage() {
  const [articulos, ventas] = await Promise.all([
    obtenerArticulos(),
    obtenerVentas(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-green-800">Registrar Venta</h1>
        <VentaForm articulos={articulos} onSuccess={() => {}} />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-green-800">Ventas Registradas</h2>
        <VentasList ventas={ventas} />
      </div>
    </div>
  );
}
