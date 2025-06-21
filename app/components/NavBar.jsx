'use client';

import { usePathname } from 'next/navigation';
import { Home, Package, ShoppingCart, Factory, ClipboardList, UserCircle } from 'lucide-react';
import Link from 'next/link';

const links = [
  { href: '/', icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
  { href: '/articulos', icon: <Package className="w-5 h-5" />, label: 'Maestro de Artículos' },
  { href: '/proveedores', icon: <Factory className="w-5 h-5" />, label: 'Proveedores' },
  { href: '/ordenesCompra', icon: <ClipboardList className="w-5 h-5" />, label: 'Órdenes de Compra' },
  { href: '/ventas', icon: <ShoppingCart className="w-5 h-5" />, label: 'Ventas' },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <nav className="hidden md:flex flex-col justify-between bg-black text-white w-64 h-screen px-6 py-8">
        <div>
          <div className="flex items-center justify-center mb-10">
            <span className="text-2xl font-extrabold tracking-wide">FullStock</span>
          </div>

          <ul className="space-y-2">
            {links.map(({ href, icon, label }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center h-16 px-4 rounded-md transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <span className="mr-3">{icon}</span>
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col items-start text-xs text-gray-400 space-y-1">
          <span className="text-gray-600">v1.2.0</span>
        </div>
      </nav>
    </>
  );
}
