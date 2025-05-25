// components/Navbar.js
import { Home, Package, ShoppingCart, Factory, ClipboardList } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="bg-black text-white w-64 h-screen p-6  ">
      <div className="flex items-center mb-8">
        <span className="font-bold text-xl">FullStock</span>
      </div>
      <ul className="space-y-4">
        <li>
          <Link href="/" className="flex items-center p-2 rounded-md hover:bg-gray-700">
            <Home className="mr-3 w-5 h-5" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link href="/articulos" className="flex items-center p-2 rounded-md hover:bg-gray-700">
            <Package className="mr-3 w-5 h-5" />
            <span>Maestro de Artículos</span>
          </Link>
        </li>
        <li>
          <Link href="/proveedores" className="flex items-center p-2 rounded-md hover:bg-gray-700">
            <Factory className="mr-3 w-5 h-5" />
            <span>Proveedores</span>
          </Link>
        </li>
        <li>
          <Link href="/ordenes" className="flex items-center p-2 rounded-md hover:bg-gray-700">
            <ClipboardList className="mr-3 w-5 h-5" />
            <span>Órdenes de Compra</span>
          </Link>
        </li>
        <li>
          <Link href="/ventas" className="flex items-center p-2 rounded-md hover:bg-gray-700">
            <ShoppingCart className="mr-3 w-5 h-5" />
            <span>Ventas</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}