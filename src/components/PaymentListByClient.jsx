import React, { useState, useEffect } from "react";
import paymentService from "../services/paymentService";
import CreatePaymentModal from "./CreatePaymentModal";
import { toast } from "react-toastify";

const PaymentListByClient = ({ polizaId, clientName, onBack }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await paymentService.getPaymentsByPoliza(polizaId);
      setPayments(response || []);
    } catch (error) {
      console.error("Error fetching payment data:", error);
      setError("Error al cargar los datos de pagos");
      toast.error("Error al cargar los datos de pagos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [polizaId]);

  const handleCreatePayment = (newPayment) => {
    setPayments((prevPayments) => [newPayment, ...prevPayments]);
    fetchPayments(); // Refresh the list after creating a new payment
  };

  if (loading) {
    return <div>Cargando datos de pagos...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">PAGOS</h1>
        <div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-md mr-2"
          >
            Crear Pago
          </button>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 rounded-md text-sm"
          >
            Volver
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">{clientName}</h2>
      </div>

      {payments.length === 0 ? (
        <p>No hay pagos registrados para esta póliza.</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Fecha de pago</th>
              <th className="p-2 text-left">Estado de pago</th>
              <th className="p-2 text-left">Emisión de pago</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b">
                <td className="p-2">{payment.id}</td>
                <td className="p-2">
                  {new Date(payment.fecha_pago).toLocaleDateString()}
                </td>
                <td className="p-2">{payment.estado_pago}</td>
                <td className="p-2">${payment.emision_pago.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showCreateModal && (
        <CreatePaymentModal
          polizaId={polizaId}
          onClose={() => setShowCreateModal(false)}
          onPaymentCreated={handleCreatePayment}
        />
      )}
    </div>
  );
};

export default PaymentListByClient;
