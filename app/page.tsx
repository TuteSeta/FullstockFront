"use client";

import {
  AreaChart,
  Card,
  Text,
  Metric,
  Flex,
} from "@tremor/react";

const chartdata = [
  { date: "Jan 23", SolarPanels: 2890 },
  { date: "Feb 23", SolarPanels: 2756 },
  { date: "Mar 23", SolarPanels: 3322 },
  { date: "Apr 23", SolarPanels: 3470 },
  { date: "May 23", SolarPanels: 3475 },
  { date: "Jun 23", SolarPanels: 3129 },
  { date: "Jul 23", SolarPanels: 3490 },
  { date: "Aug 23", SolarPanels: 2903 },
  { date: "Sep 23", SolarPanels: 2643 },
  { date: "Oct 23", SolarPanels: 2837 },
  { date: "Nov 23", SolarPanels: 2954 },
  { date: "Dec 23", SolarPanels: 3239 },
];

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
    <Card className="bg-[#1f2937] text-white rounded-xl shadow-md">
      <Flex justifyContent="between" alignItems="start">
        <div>
          <Text className="text-sm text-gray-300">{title}</Text>
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
  return (
    <main className="w-full min-h-screen p-8 bg-black">
      <h1 className="text-3xl font-bold text-gray-200 mb-6">
        Bienvenido a FullStock
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total de productos" value="4.534" delta="+12%" increase />
        <StatCard title="Stock disponible" value="2.137" delta="-6%" increase={false} />
        <StatCard title="Pedidos realizados" value="1.952" delta="+7%" increase />
        <StatCard title="Ventas realizadas" value="803" delta="-10%" increase={false} />
      </div>
      <div className="flex justify-between flex-row gap-10">
        {/* Stock por artículo */}
        <div className="mt-12 w-1/2">
        
          <h2 className="text-2xl text-white font-bold ">Niveles de Stock</h2>
          <Card className=" text-white p-6 rounded-lg shadow-md">
            {articulos.map((item, idx) => {
              const porcentaje = Math.round((item.cantidad / item.total) * 100);
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
                      className={`h-full transition-all duration-500 rounded-full ${porcentaje < 50
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
          <h2 className=" font-bold text-2xl text-white">Gráfico de ventas</h2>
          <AreaChart
            className="h-80 text-white"
            data={chartdata}
            index="date"
            categories={["SolarPanels"]}
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
