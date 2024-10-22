import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import clientService from "../services/clientService";

const NewPolicyModal = ({ isOpen, onClose, onSave, clientId }) => {
  const [formData, setFormData] = useState({
    insuranceType: "",
    netPremium: "",
    insured: "",
    validFrom: "",
    validTo: "",
    paymentFrequency: "mensual",
    pdfFile: null,
    errors: {},
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para manejar el proceso de envío

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Efecto para calcular la fecha de finalización automáticamente
  useEffect(() => {
    if (formData.validFrom) {
      const startDate = new Date(formData.validFrom);
      let endDate;

      // La fecha de fin siempre debe estar dentro de un año
      if (formData.paymentFrequency === "anual") {
        // Si es anual, la fecha de fin es exactamente un año después
        endDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
      } else {
        // Si es mensual, la fecha de fin es el mismo día, pero dentro del mismo mes del año siguiente
        endDate = new Date(startDate.setMonth(startDate.getMonth() + 12));
      }

      setFormData((prev) => ({
        ...prev,
        validTo: endDate.toISOString().split("T")[0], // Solo la parte de la fecha
      }));
    }
  }, [formData.validFrom, formData.paymentFrequency]);

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};
    if (!formData.insuranceType)
      newErrors.insuranceType = "Tipo de seguro es requerido.";
    if (!formData.netPremium || formData.netPremium <= 0)
      newErrors.netPremium = "Prima neta debe ser mayor a cero.";
    if (!formData.insured)
      newErrors.insured = "Nombre del asegurado es requerido.";
    if (!formData.validFrom)
      newErrors.validFrom = "Fecha de vigencia inicial es requerida.";

    setFormData((prev) => ({ ...prev, errors: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación del formulario
    if (!validateForm()) return;

    // Validar que el archivo sea un PDF y que no exceda los 5MB
    if (formData.pdfFile) {
      if (formData.pdfFile.type !== "application/pdf") {
        alert("Por favor, sube un archivo en formato PDF.");
        return;
      }
      if (formData.pdfFile.size > 5 * 1024 * 1024) { // 5MB máximo
        alert("El archivo PDF no debe exceder los 5MB.");
        return;
      }
    }

    setIsSubmitting(true); // Deshabilita el botón mientras se envía

    try {
      const policyData = {
        tipo_seguro: formData.insuranceType,
        prima_neta: formData.netPremium,
        asegurado: formData.insured,
        vigencia_de: formData.validFrom,
        vigencia_hasta: formData.validTo,
        periodicidad_pago: formData.paymentFrequency,
      };

      // Enviar la póliza y el archivo PDF
      await clientService.addClientPolicy(clientId, policyData, formData.pdfFile);

      console.log("Policy added successfully");
      onClose();
      onSave(formData);
    } catch (error) {
      console.error("Error adding policy", error);
    } finally {
      setIsSubmitting(false); // Rehabilita el botón tras completar el envío
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">NUEVA POLIZA</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                TIPO DE SEGURO*
              </label>
              <input
                type="text"
                name="insuranceType"
                value={formData.insuranceType}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  formData.errors.insuranceType
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500`}
              />
              {formData.errors.insuranceType && (
                <p className="text-red-500 text-sm">
                  {formData.errors.insuranceType}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PRIMA NETA*
              </label>
              <input
                type="number"
                name="netPremium"
                value={formData.netPremium}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  formData.errors.netPremium
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500`}
              />
              {formData.errors.netPremium && (
                <p className="text-red-500 text-sm">
                  {formData.errors.netPremium}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ASEGURADO*
              </label>
              <input
                type="text"
                placeholder="NOMBRES Y APELLIDOS"
                name="insured"
                value={formData.insured}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  formData.errors.insured ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500`}
              />
              {formData.errors.insured && (
                <p className="text-red-500 text-sm">
                  {formData.errors.insured}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PERIODICIDAD DE PAGO
              </label>
              <select
                name="paymentFrequency"
                value={formData.paymentFrequency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value="mensual">Mensual</option>
                <option value="anual">Anual</option>
              </select>
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  VIGENCIA DEL*
                </label>
                <input
                  type="date"
                  name="validFrom"
                  value={formData.validFrom}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    formData.errors.validFrom
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500`}
                />
                {formData.errors.validFrom && (
                  <p className="text-red-500 text-sm">
                    {formData.errors.validFrom}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  AL
                </label>
                <input
                  type="date"
                  name="validTo"
                  value={formData.validTo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  disabled
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SUBIR POLIZA
              </label>
              <input
                type="file"
                name="pdfFile"
                accept="application/pdf"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600"
              disabled={isSubmitting} // Deshabilitado mientras se está enviando
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPolicyModal;
