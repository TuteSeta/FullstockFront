"use client";
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function ArticuloForm({ articulo, onSuccess }) {
  const [formData, setFormData] = useState({
    nombreArt: '',
    descripcion: '',
    demanda: '',
    cantArticulo: '',
    precioArticulo: '',
    costoMantenimiento: '',
    desviacionDemandaLArticulo: '',
    desviacionDemandaTArticulo: '',
    nivelServicioDeseado: '',
    codProveedorPredeterminado: '',
    modeloInventarioLoteFijo: {
      loteOptimo: '',
      puntoPedido: '',
      stockSeguridadLF: ''
    },
    modeloInventarioIntervaloFijo: {
      intervaloTiempo: '',
      stockSeguridadIF: '',
      inventarioMaximo: '',
      cantidadPedido: '' 
    }
  });

  const [modeloSeleccionado, setModeloSeleccionado] = useState('');
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    if (articulo) {
      setFormData({
        ...articulo,
        codProveedorPredeterminado: articulo.proveedorPredeterminado?.codProveedor ?? '',
      });
      setModeloSeleccionado(articulo.modeloInventarioLoteFijo ? 'loteFijo' : 'intervaloFijo');
    }
  }, [articulo]);


  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedores`)
      .then((res) => res.json())
      .then(setProveedores)
      .catch((err) => console.error('Error al cargar proveedores:', err));
  }, []);

  const handleChange = (e) => {

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModeloChange = (e) => {
    setModeloSeleccionado(e.target.value);
    setFormData((prev) => ({
      ...prev,
      modeloInventarioLoteFijo: {
        loteOptimo: '',
        puntoPedido: '',
        stockSeguridadLF: ''
      },
      modeloInventarioIntervaloFijo: {
        intervaloTiempo: '',
        stockSeguridadIF: '',
        inventarioMaximo: '',
        cantidadPedido: ''
      },
    }));
  };

  const handleModeloFieldChange = (e) => {
    const { name, value } = e.target;
    if (modeloSeleccionado === 'loteFijo') {
      setFormData((prev) => ({
        ...prev,
        modeloInventarioLoteFijo: {
          ...prev.modeloInventarioLoteFijo,
          [name]: value,
        }
      }));
    } else if (modeloSeleccionado === 'intervaloFijo') {
      setFormData((prev) => ({
        ...prev,
        modeloInventarioIntervaloFijo: {
          ...prev.modeloInventarioIntervaloFijo,
          [name]: value,
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let codProv = Number(formData.codProveedorPredeterminado);
    if (!codProv || isNaN(codProv)) codProv = null;

    const dataToSend = {
      ...formData,
      codProveedorPredeterminado: codProv,
      recalcularLoteFijo: modeloSeleccionado === 'loteFijo',
    };

    // Forzar estructura clara según modelo
    if (modeloSeleccionado === 'loteFijo') {
      dataToSend.modeloSeleccionado = modeloSeleccionado;
      delete dataToSend.modeloInventarioIntervaloFijo;
    } else if (modeloSeleccionado === 'intervaloFijo') {
      delete dataToSend.modeloInventarioLoteFijo;
      // datos de intervalo ya están en formData.modeloInventarioIntervaloFijo
    } else {
      delete dataToSend.modeloInventarioLoteFijo;
      delete dataToSend.modeloInventarioIntervaloFijo;
      dataToSend.codProveedorPredeterminado = null;
    }

    const url = articulo
      ? `${process.env.NEXT_PUBLIC_API_URL}/articulos/${articulo.codArticulo}`
      : `${process.env.NEXT_PUBLIC_API_URL}/articulos`;

    const method = articulo ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error('Error al guardar');

      // Reset
      setFormData({
        nombreArt: '',
        descripcion: '',
        demanda: '',
        cantArticulo: '',
        precioArticulo: '',
        costoMantenimiento: '',
        desviacionDemandaLArticulo: '',
        desviacionDemandaTArticulo: '',
        nivelServicioDeseado: '',
        codProveedorPredeterminado: '',
        modeloInventarioLoteFijo: {
          loteOptimo: '',
          puntoPedido: '',
          stockSeguridadLF: ''
        },
        modeloInventarioIntervaloFijo: {
          intervaloTiempo: '',
          stockSeguridadIF: ''
        }
      });
      setModeloSeleccionado('');

      Swal.fire({
        icon: 'success',
        title: articulo ? 'Artículo actualizado' : 'Artículo creado',
        text: articulo
          ? `"${formData.nombreArt}" fue editado correctamente.`
          : `"${formData.nombreArt}" fue creado con éxito.`,
        confirmButtonColor: '#3085d6',
      });

      onSuccess();
    } catch (error) {
      console.error('Error al guardar el artículo:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un problema al guardar el artículo. Verificá los datos e intentá de nuevo.',
        confirmButtonColor: '#d33',
      });
    }
  };


  return (
    <>
      <div className='flex justify-center px-5 pb-5'>
        <h1 className='text-2xl font-bold'> {articulo ? 'Editar Artículo' : 'Crear Artículo'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: 'nombreArt', label: 'Nombre Artículo' },
          { name: 'descripcion', label: 'Descripción' },
          { name: 'demanda', label: 'Demanda', type: 'number' },
          { name: 'cantArticulo', label: 'Cantidad Articulo', type: 'number' },
          { name: 'precioArticulo', label: 'Precio Articulo', type: 'number' },
          { name: 'costoMantenimiento', label: 'Costo Mantenimiento', type: 'number' },
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
            className="border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-black"
          />

        ))}

        {/* Selector de modelo de inventario*/}
        <select
          name="codProveedorPredeterminado"
          value={formData.codProveedorPredeterminado ?? ''}
          onChange={handleChange}
          className="border border-gray-600 rounded px-3 py-2 bg-white text-black col-span-full"
        >
          <option value="">Seleccionar proveedor predeterminado</option>
          {proveedores.map((prov) => (
            <option key={prov.codProveedor} value={prov.codProveedor}>
              {prov.nombreProveedor}
            </option>
          ))}
        </select>
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
            <p className="text-sm italic text-gray-500 col-span-full">
              El lote óptimo, punto de pedido y stock de seguridad serán calculados automáticamente por el sistema.
            </p>
          </>
        )}

        {modeloSeleccionado === 'intervaloFijo' && (
          <>
            <input
              type="number"
              name="intervaloTiempo"
              placeholder="Intervalo de Tiempo (días)"
              value={formData.modeloInventarioIntervaloFijo?.intervaloTiempo || ''}
              onChange={handleModeloFieldChange}
              required
              className="border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-black col-span-full"
            />

            <p className="text-sm italic text-gray-500 col-span-full">
              El <strong>stock de seguridad</strong> y el <strong>inventario máximo</strong> serán calculados automáticamente por el sistema al guardar.
            </p>

            {articulo && (
              <>
                <input
                  type="number"
                  name="stockSeguridadIF"
                  placeholder="Stock Seguridad (calculado)"
                  value={formData.modeloInventarioIntervaloFijo?.stockSeguridadIF || ''}
                  disabled
                  className="border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black col-span-full"
                />
                <input
                  type="number"
                  name="inventarioMaximo"
                  placeholder="Inventario Máximo (calculado)"
                  value={formData.modeloInventarioIntervaloFijo?.inventarioMaximo || ''}
                  disabled
                  className="border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black col-span-full"
                />
                <input
                  type="number"
                  name="cantidadPedido"
                  placeholder="Cantidad Pedido (calculado)"
                  value={formData.modeloInventarioIntervaloFijo?.cantidadPedido || ''}
                  disabled
                  className="border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black col-span-full"
                />
                <input
                  type="number"
                  name="cgi"
                  placeholder="Costo Global de Inventario (CGI)"
                  value={articulo.cgi ?? ''}
                  disabled
                  className="border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black col-span-full"
                />
              </>
            )}
          </>
        )}


        {/* Botón de envío */}
        <button
          type="submit"
          className="col-span-full bg-blue-500 text-white w-1/2 mx-auto px-4 py-2 rounded hover:bg-blue-600 transition cursor-pointer"
        >
          {articulo ? 'Guardar Cambios' : 'Crear Artículo'}
        </button>
      </form>
    </>
  );
}