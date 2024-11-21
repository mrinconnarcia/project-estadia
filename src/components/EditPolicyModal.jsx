import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const EditPolicyModal = ({ policy, onClose, onUpdate }) => {
  const [editedPolicy, setEditedPolicy] = useState(policy || {});
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (policy) {
      setEditedPolicy({
        ...policy,
        vigencia_de: formatDate(policy.vigencia_de),
        vigencia_hasta: formatDate(policy.vigencia_hasta),
      });
    }
  }, [policy]);

  // Formatear fechas a YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return ""; // Validar fechas nulas o vacías
    const date = new Date(dateString);
    return isNaN(date) ? "" : date.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPolicy((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const updatedPolicy = { ...editedPolicy };

      await onUpdate(updatedPolicy);
      onClose(); // Cierra el modal después de la actualización exitosa
    } catch (error) {
      console.error("Error al actualizar la póliza", error);
      setErrorMessage(error.message || "Error al actualizar la póliza");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Editar Póliza</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="tipo_seguro"
              className="block text-gray-700 font-bold mb-2"
            >
              Tipo de seguro
            </label>
            <input
              type="text"
              id="tipo_seguro"
              name="tipo_seguro"
              value={editedPolicy.tipo_seguro || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="prima_neta"
              className="block text-gray-700 font-bold mb-2"
            >
              Prima neta
            </label>
            <input
              type="number"
              id="prima_neta"
              name="prima_neta"
              value={editedPolicy.prima_neta || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="asegurado"
              className="block text-gray-700 font-bold mb-2"
            >
              Asegurado
            </label>
            <input
              type="text"
              id="asegurado"
              name="asegurado"
              value={editedPolicy.asegurado || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="vigencia_de"
              className="block text-gray-700 font-bold mb-2"
            >
              Vigencia desde
            </label>
            <input
              type="date"
              id="vigencia_de"
              name="vigencia_de"
              value={editedPolicy.vigencia_de || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="vigencia_hasta"
              className="block text-gray-700 font-bold mb-2"
            >
              Vigencia hasta
            </label>
            <input
              type="date"
              id="vigencia_hasta"
              name="vigencia_hasta"
              value={editedPolicy.vigencia_hasta || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 mr-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition duration-300"
            >
              Guardar cambios
            </button>
          </div>
        </form>
        {errorMessage && (
          <div className="text-red-500 mt-4">{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default EditPolicyModal;
