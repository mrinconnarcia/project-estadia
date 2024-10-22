import React, { useState, useEffect } from 'react';
import clientService from '../services/clientService';
import { toast } from 'react-toastify';

const EditClientModal = ({ client, userId, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    telefono: '',
    contacto_emergencia: '',
    correo: '',
    fecha_nacimiento: '',
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (client) {
      setFormData({
        nombre: client.nombre || '',
        apellidos: client.apellidos || '',
        telefono: client.telefono || '',
        contacto_emergencia: client.contacto_emergencia || '',
        correo: client.correo || '',
        fecha_nacimiento: client.fecha_nacimiento ? client.fecha_nacimiento.split('T')[0] : '',
      });
    }
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!client || !client.id || !userId) {
      toast.error('Error: Datos del cliente o usuario no disponibles');
      return;
    }
    try {
      console.log('Sending update request with data:', formData);
      const updatedClient = await clientService.updateClient(userId, client.id, formData);
      console.log('Received updated client data:', updatedClient);
      onUpdate(updatedClient);
      toast.success('Cliente actualizado exitosamente');
      onClose();
    } catch (error) {
      console.error('Error updating client:', error);
      if (error.response) {
        toast.error(`Error al actualizar el cliente: ${error.response.data.message}`);
      } else {
        toast.error('Error al actualizar el cliente: Error de conexión');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
        <div className="mt-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Editar Cliente</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="nombre"
                id="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700">Apellidos</label>
              <input
                type="text"
                name="apellidos"
                id="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                id="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label htmlFor="contacto_emergencia" className="block text-sm font-medium text-gray-700">Contacto de Emergencia</label>
              <input
                type="tel"
                name="contacto_emergencia"
                id="contacto_emergencia"
                value={formData.contacto_emergencia}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700">Correo</label>
              <input
                type="email"
                name="correo"
                id="correo"
                value={formData.correo}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
              <input
                type="date"
                name="fecha_nacimiento"
                id="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition duration-300"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditClientModal;