'use client';
import { useState, useEffect } from 'react';
import ProveedoresForm from '../components/proveedores/ProveedoresForm';
import ProveedorCard from '../components/proveedores/ProveedorCard';
import { Truck, Plus } from 'lucide-react';
import BackButton from '../components/BackButton';
import { motion, AnimatePresence } from 'framer-motion';
import { parseProveedorArticuloExcel } from '../utils/importHelpers';
import Swal from 'sweetalert2';

type Proveedor = {
  codProveedor: number;
  nombreProveedor: string;
  fechaHoraBajaProveedor?: string | null;
};

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);

  const fetchProveedores = async (soloActivos = true) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedores?soloActivos=${soloActivos}`);
    const data = await res.json();
    setProveedores(data);
  };

  useEffect(() => {
    fetchProveedores(!mostrarInactivos); // si querés ver inactivos, no filtrás activos
  }, [mostrarInactivos]);

  useEffect(() => {
    fetchProveedores();
  }, []);


  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const rows = await parseProveedorArticuloExcel(file);
      const proveedoresCreados = new Map<string, number>();

      const resArticulos = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos`);
      const articulos = await resArticulos.json();

      let registrosExitosos = 0;
      let registrosFallidos: string[] = [];

      for (const row of rows) {
        const {
          nombreProveedor,
          nombreArt,
          costoUnitarioAP, // ✅ Campo correcto
          cargoPedidoAP,
          demoraEntregaAP,
        } = row;

        if (!nombreProveedor || !nombreArt) {
          registrosFallidos.push('Fila con proveedor/artículo vacío');
          continue;
        }

        let codProveedor: number;

        if (proveedoresCreados.has(nombreProveedor)) {
          codProveedor = proveedoresCreados.get(nombreProveedor)!;
        } else {
          const existing = proveedores.find((p) => p.nombreProveedor === nombreProveedor);

          if (existing) {
            codProveedor = existing.codProveedor;
          } else {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedores`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ nombreProveedor }),
            });

            if (!res.ok) {
              registrosFallidos.push(`Error creando proveedor: ${nombreProveedor}`);
              continue;
            }

            const newProv = await res.json();
            codProveedor = newProv.codProveedor;
            await fetchProveedores();
          }

          proveedoresCreados.set(nombreProveedor, codProveedor);
        }

        const articulo = articulos.find((a: any) => a.nombreArt === nombreArt);
        if (!articulo) {
          registrosFallidos.push(`Artículo no encontrado: "${nombreArt}"`);
          continue;
        }

        const relRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor-articulos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            codProveedor,
            codArticulo: articulo.codArticulo,
            costoUnitarioAP: Number(costoUnitarioAP), // ✅ corregido
            cargoPedidoAP: Number(cargoPedidoAP),
            demoraEntregaAP: Number(demoraEntregaAP),
          }),

        });

        if (!relRes.ok) {
          registrosFallidos.push(`Error asociando artículo "${nombreArt}" con proveedor "${nombreProveedor}"`);
          continue;
        }

        registrosExitosos++;
      }

      if (registrosExitosos > 0) {
        Swal.fire({
          icon: registrosFallidos.length > 0 ? 'warning' : 'success',
          title: registrosFallidos.length > 0 ? 'Importación parcial' : '¡Importación exitosa!',
          text: registrosFallidos.length > 0
            ? `Se importaron ${registrosExitosos} registros correctamente. ${registrosFallidos.length} fallaron.`
            : `Todos los registros se importaron correctamente.`,
          confirmButtonColor: '#3085d6',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error en la importación',
          text: 'No se pudo importar ningún registro. Verifica el Excel y los datos.',  
          confirmButtonColor: '#d33',
        });
      }

    } catch (error) {
      console.error('Error al importar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: 'Ocurrió un error durante la importación. Verifica el formato del archivo.',
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 text-gray-800 px-4 sm:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <BackButton />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center">
            <Truck className="w-7 h-7 text-blue-600" />
            <h1 className="text-3xl font-bold ml-2">Gestión de proveedores</h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <label className="relative cursor-pointer bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-center">
              📁 Importar Excel
              <input
                type="file"
                accept=".xlsx"
                onChange={handleImportExcel}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </label>
            <button
              onClick={() => setMostrarFormulario(true)}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              <Plus className="mr-2" />
              Agregar proveedor
            </button>
            <button
              onClick={() => setMostrarInactivos(prev => !prev)}
              className="text-sm text-blue-600 underline"
            >
              {mostrarInactivos ? 'Ocultar inactivos' : 'Mostrar también dados de baja'}
            </button>

          </div>
        </div>

        {/* Encabezado tipo tabla */}
        <div className="hidden sm:grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-200 rounded-lg">
          <div className="font-semibold">Nombre</div>
          <div className="font-semibold text-center">Baja</div>
        </div>

        {/* Lista de proveedores */}
        <div className="flex flex-col gap-4">
          {proveedores.map((proveedor) => (
            <ProveedorCard key={proveedor.codProveedor} proveedor={proveedor} />
          ))}
        </div>

        {/* Modal del formulario */}
        <AnimatePresence>
          {mostrarFormulario && (
            <>
              <motion.div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMostrarFormulario(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-50 flex items-center justify-center px-4"
              >
                <div
                  className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full text-gray-800 relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setMostrarFormulario(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center transition hover:bg-gray-200"
                    title="Cerrar"
                  >
                    ×
                  </button>

                  <ProveedoresForm
                    onSuccess={() => {
                      fetchProveedores();
                      setMostrarFormulario(false);
                    }}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
