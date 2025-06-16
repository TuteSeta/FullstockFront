"use client";

import {
  AreaChart,
  Card,
  Text,
  Metric,
  Flex,
} from "@tremor/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface VentaMensual {
  date: string;
  totalVentas: number;
}



const articulos = [
  { nombre: "Silk Blend Summer Dress", cantidad: 105, total: 110 },
  { nombre: "High-Waist Denim Jeans", cantidad: 50, total: 80 },
  { nombre: "Women's Wool Cardigan", cantidad: 40, total: 80 },
  { nombre: "Kids' Graphic Sweatshirt", cantidad: 10, total: 100 },
];

function StatCard({
  title,
  value,
  delta,
  increase = true,
}: {
  title: string;
  value: string | number;
  delta: string;
  increase?: boolean;
}) {
  return (
    <Card className="bg-[#1f2937] text-white rounded-xl shadow-md cursor-pointer hover:opacity-70 hover:scale-[1.03] duration-300">
      <Flex justifyContent="between" alignItems="start">
        <div>
          <Text className="text-sm font-bold text-gray-300">{title}</Text>
          <Metric>{value}</Metric>
        </div>
        <Text
          className={`font-semibold text-sm ${increase ? "text-green-500" : "text-red-500"
            }`}
        >
          {delta}
        </Text>
      </Flex>
      <Text className="text-xs text-gray-400 mt-2">
        Comparado con la semana pasada
      </Text>
    </Card>
  );
}

export default function Home() {
  const [chartdata, setChartdata] = useState<VentaMensual[]>([]);
  const [totalArticulos, setTotalArticulos] = useState<number | null>(null);
  const [delta, setDelta] = useState<number | null>(null);
  const [stockDisponible, setStockDisponible] = useState<number | null>(null);
  const [stockDelta, setStockDelta] = useState<number | null>(null);
  const [ventas, setVentas] = useState<number | null>(null);
  const [ventasDelta, setVentasDelta] = useState<number | null>(null);



  const [stockBajo, setStockBajo] = useState<
    { nombre: string; cantidad: number; total: number; stockSeguridad: number }[]
  >([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos/stock-bajo`)
      .then((res) => res.json())
      .then((data) => setStockBajo(data))
      .catch((err) => console.error("Error al obtener stock bajo:", err));
  }, []);


  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/ventas/historico`)
      .then(res => res.json())
      .then(data => {
        setVentas(data.actual);
        setVentasDelta(data.delta);
      })
      .catch(err => console.error("Error al obtener ventas:", err));
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos/stock/historico`)
      .then(res => res.json())
      .then(data => {
        setStockDisponible(data.actual);
        setStockDelta(data.delta);
      })
      .catch(err => console.error("Error al obtener stock:", err));
  }, []);


  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos/count`)
      .then(res => res.json())
      .then(data => setTotalArticulos(data.total))
      .catch(err => console.error("Error al contar artículos:", err));
  }, []);


  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/ventas/dashboard/ventas-diarias`)
      .then(res => res.json())
      .then(data => setChartdata(data))
      .catch(err => console.error("Error al cargar ventas:", err));
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos/historico`)
      .then(res => res.json())
      .then(data => {
        setTotalArticulos(data.actual);

        if (data.anterior && data.anterior > 0) {
          const diff = ((data.actual - data.anterior) / data.anterior) * 100;
          setDelta(diff);
        } else {
          setDelta(0); // o null si preferís ocultarlo
        }
      })
      .catch(err => {
        console.error("Error al obtener históricos:", err);
        setDelta(null); // para manejar errores silenciosamente
      });
  }, []);


  return (
    <main className="w-full min-h-screen p-8 bg-black">
      <h1 className="text-3xl font-bold text-gray-200 mb-6">
        Bienvenido a FullStock
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/articulos" className="block">
          <StatCard
            title="Total de productos"
            value={totalArticulos?.toLocaleString("es-AR") ?? "Cargando..."}
            delta={delta !== null ? `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%` : "Sin datos"}
            increase={delta !== null && delta >= 0}
          />
        </Link>

        <Link href="/articulos" className="block">
          <StatCard
            title="Stock disponible"
            value={
              stockDisponible !== null
                ? stockDisponible.toLocaleString("es-AR")
                : "Cargando..."
            }
            delta={
              stockDelta !== null
                ? `${stockDelta >= 0 ? "+" : ""}${stockDelta.toFixed(1)}%`
                : "..."
            }
            increase={stockDelta !== null && stockDelta >= 0}
          />
        </Link>

        <Link href="/ordenesCompra" className="block">
          <StatCard
            title="Pedidos realizados"
            value="1.952"
            delta="+7%"
            increase
          />
        </Link>

        <Link href="/ventas" className="block">
          <StatCard
            title="Ventas realizadas"
            value={ventas !== null ? ventas.toLocaleString("es-AR") : "Cargando..."}
            delta={
              ventasDelta !== null
                ? `${ventasDelta >= 0 ? "+" : ""}${ventasDelta.toFixed(1)}%`
                : "..."
            }
            increase={ventasDelta !== null && ventasDelta >= 0}
          />
        </Link>

      </div>

      <div className="flex justify-between flex-row gap-10">
        {/* Stock por artículo */}
        <div className="mt-12 w-1/2">
          <h2 className="text-2xl text-white font-bold">Niveles de Stock</h2>
          <Card className="text-white p-6 rounded-lg shadow-md">
            {stockBajo.map((item, idx) => {
              const porcentaje = Math.round((item.cantidad / item.total) * 100);
              const estaEnRojo = item.cantidad <= item.stockSeguridad;

              return (
                <div key={idx} className="mb-6">
                  <div className="flex justify-between mb-1 text-sm">
                    <Text className="text-white">{item.nombre}</Text>
                    <Text className="text-gray-300">
                      {item.cantidad} / {item.total} restantes
                    </Text>
                  </div>
                  <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${estaEnRojo
                        ? "bg-red-500"
                        : porcentaje < 80
                          ? "bg-yellow-400"
                          : "bg-lime-400"
                        }`}
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </Card>

        </div>

        {/* Chart */}
        <div className="w-1/2 mt-12">
          <h2 className="font-bold text-2xl text-white">Gráfico de ventas</h2>
          <AreaChart
            className="h-80 text-white mt-5 "
            data={chartdata}
            index="date"
            categories={["totalVentas"]}
            valueFormatter={(number: number) =>
              `$${Intl.NumberFormat("en-US").format(number)}`
            }
            showLegend={false}
            xAxisLabel="Mes"
            yAxisLabel="USD"
          />
        </div>
      </div>
    </main>
  );
}
