"use client"
import { type } from 'os';
import { useState } from 'react';

export default function ArticuloForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    codArticulo: '',
    nombreArt: '',
    descripcion: '',
    demanda: '',
    cantArticulo: '',
    cantMaxArticulo: '',
    costoAlmacenamiento: '',
    costoMantenimiento: '',
    costoPedido: '',
    costoCompra: '',
    desviacionDemandaLArticulo: '',
    desviacionDemandaTArticulo: '',
    nivelServicioDeseado:''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setFormData({
        codArticulo: '',
        nombreArt: '',
        descripcion: '',
        demanda: '',
        cantArticulo: '',
        cantMaxArticulo: '',
        costoAlmacenamiento: '',
        costoMantenimiento: '',
        costoPedido: '',
        costoCompra: '',
        desviacionDemandaLArticulo: '',
        desviacionDemandaTArticulo: '',
        nivelServicioDeseado:''
      });
      onSuccess(); // actualizar lista
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { name: 'codArticulo', label: 'Código' },
        { name: 'nombreArt', label: 'Nombre Artículo' },
        { name: 'descripcion', label: 'Descripción' },
        { name: 'demanda', label: 'Demanda', type: 'number' },
        { name: 'cantArticulo', label: 'Cantidad Articulo', type: 'number' },
        { name: 'cantMaxArticulo', label: 'Cantidad Maxima Articulo', type: 'number' },
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
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      ))}
      <button
        type="submit"
        className="col-span-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Crear Artículo
      </button>
    </form>
  );
}