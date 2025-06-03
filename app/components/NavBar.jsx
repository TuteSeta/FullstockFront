'use client';

import { Home, Package, ShoppingCart, Factory, ClipboardList } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  return (
    <>
      {/* Navbar vertical para escritorio */}
      <nav className="hidden md:flex bg-black text-white w-64 h-screen p-6 flex-col">
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
            <Link href="/ordenesCompra" className="flex items-center p-2 rounded-md hover:bg-gray-700">
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

      {/* Navbar inferior para mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black text-white border-t border-gray-800 flex justify-around items-center h-16">
        <Link href="/" className="flex flex-col items-center text-xs hover:text-blue-400">
          <Home className="w-6 h-6" />
          Dashboard
        </Link>
        <Link href="/articulos" className="flex flex-col items-center text-xs hover:text-blue-400">
          <Package className="w-6 h-6" />
          Artículos
        </Link>
        <Link href="/proveedores" className="flex flex-col items-center text-xs hover:text-blue-400">
          <Factory className="w-6 h-6" />
          Proveedores
        </Link>
        <Link href="/ordenesCompra" className="flex flex-col items-center text-xs hover:text-blue-400">
          <ClipboardList className="w-6 h-6" />
          Órdenes
        </Link>
        <Link href="/ventas" className="flex flex-col items-center text-xs hover:text-blue-400">
          <ShoppingCart className="w-6 h-6" />
          Ventas
        </Link>
      </nav>
    </>
  );
}
