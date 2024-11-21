import React, { useState, useEffect, useCallback } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PaymentDetailsView from "./PaymentDetailsView";
import paymentService from "../services/paymentService";

const PaymentsList = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const limit = 5;

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserId(user.id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchPayments = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await paymentService.getPayments(userId, pagination.currentPage, limit);
      setPayments(response.pagos);
      setPagination({
        currentPage: response.current_page,
        totalPages: response.total_pages,
        total: response.total
      });
    } catch (error) {
      console.error("Error fetching payments:", error);
      setError("Error al obtener pagos. Por favor, intente de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [userId, pagination.currentPage]);

  useEffect(() => {
    if (userId) {
      fetchPayments();
    }
  }, [fetchPayments, userId]);


  const handleClientSelect = (polizaId) => {
    navigate(`/payments/${polizaId}/details`);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {selectedClient ? (
        <PaymentDetailsView
          client={selectedClient}
          onBack={() => setSelectedClient(null)}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">PAGOS</h1>
            <div className="text-sm text-gray-500">
              Total de registros: {pagination.total}
            </div>
          </div>

          {loading && payments.length === 0 ? (
            <p className="text-center py-4">Cargando pagos...</p>
          ) : error ? (
            <p className="text-center text-red-500 py-4">{error}</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 text-left">No. Pago</th>
                      <th className="py-2 px-4 text-left">Fecha de pago</th>
                      <th className="py-2 px-4 text-left">Estado de pago</th>
                      <th className="py-2 px-4 text-left">Asegurado</th>
                      <th className="py-2 px-4 text-left">Monto</th>
                      <th className="py-2 px-4 text-left">Cliente</th>
                      <th className="py-2 px-4 text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="py-2 px-4">{payment.id}</td>
                        <td className="py-2 px-4">
                          {new Date(payment.fecha_pago).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4">{payment.status}</td>
                        <td className="py-2 px-4">{payment.asegurado}</td>
                        <td className="py-2 px-4">${payment.monto}</td>
                        <td className="py-2 px-4">
                          {payment.cliente_nombre} {payment.cliente_apellidos}
                        </td>
                        <td className="py-2 px-4">
                          <button
                            className="text-gray-500 hover:text-cyan-600 transition"
                            onClick={() => handleClientSelect(payment.poliza_id)}
                          >
                            <Eye />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-500">
                  Mostrando página {pagination.currentPage} de {pagination.totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    className={`px-4 py-2 rounded-lg ${
                      pagination.currentPage === 1
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-cyan-500 text-white hover:bg-cyan-600"
                    }`}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    Anterior
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg ${
                      pagination.currentPage === pagination.totalPages
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-cyan-500 text-white hover:bg-cyan-600"
                    }`}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentsList;