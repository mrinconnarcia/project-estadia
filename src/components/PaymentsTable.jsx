import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import paymentService from "../services/paymentService";

const PaymentsTable = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { policyId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (policyId) {
      fetchPayments();
    }
  }, [policyId, currentPage]);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await paymentService.getPaymentsByPoliza(policyId, currentPage);
      setPayments(response.pagos);
      setTotalPages(response.totalPages);
    } catch (error) {
      setError("Error al obtener los pagos. Por favor, intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!policyId) return null;

  return (
    <div className="bg-white rounded-lg p-6">
      <button
        onClick={handleBack}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
      >
        Volver
      </button>
      <h2 className="text-xl font-bold mb-4">Pagos de la Póliza {policyId}</h2>
      
      {loading ? (
        <p className="text-center py-4">Cargando pagos...</p>
      ) : error ? (
        <p className="text-center text-red-500 py-4">{error}</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">ID</th>
                  <th className="py-2 px-4 text-left">Monto</th>
                  <th className="py-2 px-4 text-left">Fecha de Pago</th>
                  <th className="py-2 px-4 text-left">Estado</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-2 px-4">{payment.id}</td>
                    <td className="py-2 px-4">${payment.monto.toFixed(2)}</td>
                    <td className="py-2 px-4">{formatDate(payment.fecha_pago)}</td>
                    <td className="py-2 px-4">{payment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6">
              <button
                className={`px-4 py-2 mx-2 rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-cyan-500 text-white hover:bg-cyan-600"
                }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <span className="mx-2">
                Página {currentPage} de {totalPages}
              </span>
              <button
                className={`px-4 py-2 mx-2 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-cyan-500 text-white hover:bg-cyan-600"
                }`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentsTable;
