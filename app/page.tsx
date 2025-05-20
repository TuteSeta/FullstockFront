
import Link from 'next/link';
import { Package, ShoppingCart, Factory, ClipboardList } from 'lucide-react';

export default function Home() {
  return (
    <div>
      <main className="min-h-screen bg-gray-100 text-gray-800 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <Package className="w-7 h-7 text-blue-600" />
          Sistema de Inventario
        </h1>
        <p className="mb-6 text-lg">Bienvenido al MVP de gestión de inventario.</p>

        <h2 className="text-xl font-semibold mb-3">🔧 Módulos</h2>
        <ul className="space-y-3">
          <li className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-500" />
            <Link href="/articulos" className="text-blue-600 hover:underline">
              Maestro de Artículos
            </Link>
          </li>
          <li className="flex items-center gap-2">
            <Factory className="w-5 h-5 text-blue-500" />
            <Link href="/proveedores" className="text-blue-600 hover:underline">
              Proveedores
            </Link>
          </li>
          <li className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-500" />
            <Link href="/ordenes" className="text-blue-600 hover:underline">
              Órdenes de Compra
            </Link>
          </li>
          <li className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-500" />
            <Link href="/ventas" className="text-blue-600 hover:underline">
              Ventas
            </Link>
          </li>
        </ul>

        <footer className="mt-10 text-sm text-gray-500">
          Cátedra Investigación Operativa · 2025
        </footer>
      </div>
    </main>
    </div>
  );
}
