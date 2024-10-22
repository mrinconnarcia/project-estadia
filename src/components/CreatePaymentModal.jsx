import React, { useState } from "react";
import { toast } from "react-toastify";
import paymentService from "../services/paymentService";

const CreatePaymentModal = ({ polizaId, onClose, onPaymentCreated }) => {
  const [paymentData, setPaymentData] = useState({
    fecha_pago: "",
    estado_pago: "completado",
    emision_pago: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await paymentService.createPayment(
        polizaId,
        paymentData
      );
      toast.success("Pago creado exitosamente");
      onPaymentCreated(response.data);
      onClose();
    } catch (error) {
      console.error("Error creating payment:", error);
      toast.error("Error al crear el pago");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-5 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Crear Nuevo Pago</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="fecha_pago"
            >
              Fecha de Pago
            </label>
            <input
              type="date"
              id="fecha_pago"
              name="fecha_pago"
              value={paymentData.fecha_pago}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="estado_pago"
            >
              Estado de Pago
            </label>
            <select
              id="estado_pago"
              name="estado_pago"
              value={paymentData.estado_pago}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="completado">Completado</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="emision_pago"
            >
              Emisión de Pago
            </label>
            <input
              type="number"
              step="0.01"
              id="emision_pago"
              name="emision_pago"
              value={paymentData.emision_pago}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Crear Pago
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePaymentModal;
