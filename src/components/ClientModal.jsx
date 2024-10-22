import React, { useState, useEffect } from "react";
import clientService from "../services/clientService";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

const ClientModal = ({ client, isAdding, closeModal }) => {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    telefono: "",
    contacto_emergencia: "",
    correo: "",
    fecha_nacimiento: "",
  });

  // Llenar el formulario si se edita un cliente existente
  useEffect(() => {
    if (client && !isAdding) {
      setFormData({
        nombre: client.nombre || "",
        apellidos: client.apellidos || "",
        telefono: client.telefono || "",
        contacto_emergencia: client.contacto_emergencia || "",
        correo: client.correo || "",
        fecha_nacimiento: client.fecha_nacimiento || "",
      });
    }
  }, [client, isAdding]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserId(user.id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAdding) {
      try {
        await clientService.addClient(userId, formData);
        toast.success("Cliente agregado exitosamente", {
          duration: 3000, // Duración de la notificación
        });

        // Esperar 3 segundos antes de cerrar el modal para mostrar la notificación
        setTimeout(() => {
          closeModal();
        }, 3000);
      } catch (error) {
        console.error("Error al agregar el cliente:", error);
        toast.error("Hubo un problema al agregar el cliente.");
      }
    } else {
      // Lógica para actualizar cliente
      console.log("Actualizando cliente existente:", formData);
      // Aquí podrías agregar la lógica para actualizar un cliente existente.
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {isAdding ? "Agregar Cliente" : "Editar Cliente"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre*
                </label>
                <input
                  id="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="apellidos"
                  className="block text-sm font-medium text-gray-700"
                >
                  Apellidos*
                </label>
                <input
                  id="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="telefono"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tel/Cel*
                </label>
                <input
                  id="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="contacto_emergencia"
                  className="block text-sm font-medium text-gray-700"
                >
                  Emergencia
                </label>
                <input
                  id="contacto_emergencia"
                  value={formData.contacto_emergencia}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="correo"
                className="block text-sm font-medium text-gray-700"
              >
                Correo*
              </label>
              <input
                id="correo"
                value={formData.correo}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="fecha_nacimiento"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fecha de nacimiento
                </label>
                <input
                  id="fecha_nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={closeModal}
              className="text-gray-500 underline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-cyan-500 text-white px-4 py-2 rounded-md shadow-sm font-semibold"
            >
              {isAdding ? "Agregar" : "Guardar"}
            </button>
          </div>
        </form>

        <Toaster position="top-center" />
      </div>
    </div>
  );
};

export default ClientModal;
