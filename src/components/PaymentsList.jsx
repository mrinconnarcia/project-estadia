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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const limit = 5; // Límite de elementos por página

  // Verificación del usuario
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserId(user.id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Función para obtener los pagos
  const fetchPayments = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await paymentService.getPayments(page, limit);
      const newPayments = response.pagos; // Accede al array de pagos
      setPayments(newPayments); // No concatenamos, sobreescribimos los pagos
      setTotalPages(response.totalPages); // Actualiza el total de páginas
    } catch (error) {
      console.error("Error fetching payments:", error);
      setError("Error al obtener pagos. Por favor, intente de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [userId, page, limit]);

  // Llamada para obtener los pagos cada vez que cambia la página
  useEffect(() => {
    if (userId) {
      fetchPayments();
    }
  }, [fetchPayments, userId, page]);

  // Función para manejar la selección de cliente
  const handleClientSelect = async (polizaId) => {
    try {
      const clientDetails = await paymentService.getClientDetails(polizaId);
      setSelectedClient(clientDetails);
    } catch (error) {
      console.error("Error fetching client details", error);
    }
  };

  // Funciones para manejar la paginación
  const goToPreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const goToNextPage = () => {
    if (page < totalPages) setPage(page + 1);
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
                      <th className="py-2 px-4 text-left">Cliente</th>
                      <th className="py-2 px-4 text-left">Polizas</th>
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
                        <td className="py-2 px-4">
                          {payment.nombre} {payment.apellidos}
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

              {/* Paginación con estilo */}
              <div className="flex justify-center items-center mt-6">
                <button
                  className={`px-4 py-2 mx-2 rounded-lg ${
                    page === 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-cyan-500 text-white hover:bg-cyan-600"
                  }`}
                  onClick={goToPreviousPage}
                  disabled={page === 1}
                >
                  Anterior
                </button>

                <span className="mx-2">
                  Página {page} de {totalPages}
                </span>

                <button
                  className={`px-4 py-2 mx-2 rounded-lg ${
                    page === totalPages
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-cyan-500 text-white hover:bg-cyan-600"
                  }`}
                  onClick={goToNextPage}
                  disabled={page === totalPages}
                >
                  Siguiente
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentsList;
