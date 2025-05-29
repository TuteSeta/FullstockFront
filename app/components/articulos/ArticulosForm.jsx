"use client"
import { useState } from 'react';

export default function ArticuloForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    codArticulo: '',
    nombreArt: '',
    descripcion: '',
    demanda: '',
    costoAlmacenamiento: '',
    costoPedido: '',
    costoCompra: '',
    desviacionDemandaLArticulo: '',
    desviacionDemandaTArticulo: '',
    nivelServicioDeseado: '',
    modeloInventarioLoteFijo: undefined,
    modeloInventarioIntervaloFijo: undefined,
  });

  const [modeloSeleccionado, setModeloSeleccionado] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModeloChange = (e) => {
  setModeloSeleccionado(e.target.value);
  // limpia los datos del modelo no seleccionado
  setFormData((prev) => {
    const newData = { ...prev };
    delete newData.modeloInventarioLoteFijo;
    delete newData.modeloInventarioIntervaloFijo;
    return newData;
  });
};

  const handleModeloFieldChange = (e) => {
    const { name, value } = e.target;
    if (modeloSeleccionado === 'loteFijo') {
      setFormData((prev) => ({
        ...prev,
        modeloInventarioLoteFijo: {
          ...prev.modeloInventarioLoteFijo,
          [name]: value,
        },
        modeloInventarioIntervaloFijo: null, // limpiar el otro modelo
      }));
    } else if (modeloSeleccionado === 'intervaloFijo') {
      setFormData((prev) => ({
        ...prev,
        modeloInventarioIntervaloFijo: {
          ...prev.modeloInventarioIntervaloFijo,
          [name]: value,
        },
        modeloInventarioLoteFijo: null, // limpiar el otro modelo
      }));
    }
    
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepara ek objeto a enviar, eliminando el modelo no seleccionado
    const dataToSend = { ...formData };
    if (modeloSeleccionado === 'loteFijo') {
      delete dataToSend.modeloInventarioIntervaloFijo; // eliminar el otro modelo
    } else if (modeloSeleccionado === 'intervaloFijo') {
      delete dataToSend.modeloInventarioLoteFijo; // eliminar el otro modelo
    } else {
      delete dataToSend.modeloInventarioIntervaloFijo; // eliminar ambos modelos si no hay ninguno seleccionado
      delete dataToSend.modeloInventarioLoteFijo; // eliminar ambos modelos si no hay ninguno seleccionado
    }

    delete dataToSend.codArticulo; // <--- AGREGÁ ESTA LÍNEA

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    });

    if (res.ok) {
      setFormData({
        codArticulo: '',
        nombreArt: '',
        descripcion: '',
        demanda: '',
        costoAlmacenamiento: '',
        costoPedido: '',
        costoCompra: '',
        desviacionDemandaLArticulo: '',
        desviacionDemandaTArticulo: '',
        nivelServicioDeseado: ''
      });
      setModeloSeleccionado('');
      onSuccess(); // actualizar lista
    }
  };

  return (
    <>
      <div className='flex justify-center px-5 pb-5'>
        <h1 className='text-2xl font-bold'> Gestion de articulos</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: 'codArticulo', label: 'Código' },
          { name: 'nombreArt', label: 'Nombre Artículo' },
          { name: 'descripcion', label: 'Descripción' },
          { name: 'demanda', label: 'Demanda', type: 'number' },
          { name: 'cantArticulo', label: 'Cantidad Articulo', type: 'number' },
          { name: 'cantMaxArticulo', label: 'Cantidad Máxima Articulo', type: 'number' },
          { name: 'costoAlmacenamiento', label: 'Costo Almacenamiento', type: 'number' },
          { name: 'costoMantenimiento', label: 'Costo Mantenimiento', type: 'number' },
          { name: 'costoPedido', label: 'Costo Pedido', type: 'number' },
          { name: 'costoCompra', label: 'Costo Compra', type: 'number' },
          { name: 'desviacionDemandaLArticulo', label: 'Desviación Demanda L Artículo', type: 'number' },
          { name: 'desviacionDemandaTArticulo', label: 'Desviación Demanda T Artículo', type: 'number' },
          { name: 'nivelServicioDeseado', label: 'Nivel Servicio Deseado', type: 'number' },
        ].map(({ name, label, type = 'text' }) => (
          <input
            key={name}
            name={name}
            type={type}
            placeholder={label}
            value={formData[name]}
            onChange={handleChange}
            required
            className="border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-800 text-gray-200"
          />
        ))}

      {/* Selector de modelo de inventario*/}
      <div className="col-span-full flex gap-4 items-center">
        <label className="font-semibold">Modelo de Inventario:</label>
        <label>
          <input
            type="radio"
            name="modeloInventario"
            value="loteFijo"
            checked={modeloSeleccionado === 'loteFijo'}
            onChange={handleModeloChange}
          />
          Lote Fijo
        </label>
        <label>
          <input
            type="radio"
            name="modeloInventario"
            value="intervaloFijo"
            checked={modeloSeleccionado === 'intervaloFijo'}
            onChange={handleModeloChange}
          />
          Intervalo Fijo
        </label>
      </div>

      {/* Campos específicos del modelo de inventario */}
      {modeloSeleccionado === 'loteFijo' && (
        <>
          <input
            type="number"
            name="loteOptimo"
            placeholder="Lote Óptimo: "
            value={formData.modeloInventarioLoteFijo?.loteOptimo || ''}
            onChange={handleModeloFieldChange}
            required
            className="border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-800 text-gray-200 col-span-full"
          />
          <input
            type="number"
            name="puntoPedido"
            placeholder="Punto de Pedido: "
            value={formData.modeloInventarioLoteFijo?.puntoPedido || ''}
            onChange={handleModeloFieldChange}
            required
            className="border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-800 text-gray-200 col-span-full"
          />
          <input
            type="number"
            name="stockSeguridadLF"
            placeholder="Stock de Seguridad (Lote fijo): "
            value={formData.modeloInventarioLoteFijo?.stockSeguridadLF || ''}
            onChange={handleModeloFieldChange}
            required
            className="border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-800 text-gray-200 col-span-full"
          />
        </>
      )}
      {modeloSeleccionado === 'intervaloFijo' && (
        <>
          <input
            type="number"
            name="intervaloTiempo"
            placeholder="Intervalo de Tiempo: "
            value={formData.modeloInventarioIntervaloFijo?.intervaloTiempo || ''}
            onChange={handleModeloFieldChange}
            required
            className="border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-800 text-gray-200 col-span-full"
          />
          <input
            type="number"
            name="stockSeguridadIF"
            placeholder="Stock de Seguridad (Intervalo fijo): "
            value={formData.modeloInventarioIntervaloFijo?.stockSeguridadIF || ''}
            onChange={handleModeloFieldChange}
            required
            className="border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-800 text-gray-200 col-span-full"
          />
        </>
      )}

        {/* Botón de envío */}
        <button
          type="submit"
          className="col-span-full bg-blue-500 text-white w-1/2 mx-auto px-4 py-2 rounded hover:bg-blue-600 transition cursor-pointer"
        >
          Crear Artículo
        </button>
      </form>
    </>
  );
}