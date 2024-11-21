import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import paymentService from "../services/paymentService";

const PaymentsTable = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const [polizaInfo, setPolizaInfo] = useState(null);
  
  const { policyId } = useParams();
  const navigate = useNavigate();
  const limit = 5;

  useEffect(() => {
    if (policyId) {
      fetchPayments();
    }
  }, [policyId, pagination.currentPage]);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await paymentService.getPaymentsByPoliza(
        policyId, 
        pagination.currentPage,
        limit
      );
      
      setPayments(response.pagos);
      setPagination({
        currentPage: response.current_page,
        totalPages: response.total_pages,
        total: response.total
      });

      // Si tenemos información de la póliza en el primer pago, la guardamos
      if (response.pagos.length > 0 && response.pagos[0].poliza) {
        setPolizaInfo(response.pagos[0].poliza);
      }
    } catch (error) {
      setError("Error al obtener los pagos. Por favor, intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({
        ...prev,
        currentPage: newPage
      }));
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!policyId) return null;

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
        >
          Volver
        </button>
        <h2 className="text-xl font-bold">Pagos de la Póliza {policyId}</h2>
      </div>

      {polizaInfo && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-2">Información de la Póliza</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Asegurado</p>
              <p className="font-medium">{polizaInfo.asegurado}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Prima Neta</p>
              <p className="font-medium">{formatCurrency(polizaInfo.prima_neta)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Periodicidad</p>
              <p className="font-medium capitalize">{polizaInfo.periodicidad_pago}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Aseguradora</p>
              <p className="font-medium">{polizaInfo.aseguradora}</p>
            </div>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-4 bg-red-50 rounded-lg">
          {error}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto shadow-sm rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Pago</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Emisión</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 whitespace-nowrap">{payment.id}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{formatCurrency(payment.monto)}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{formatDate(payment.fecha_pago)}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        payment.status === 'pagado' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">{formatDate(payment.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center mt-6 px-4">
            <div className="text-sm text-gray-500">
              Mostrando {payments.length} de {pagination.total} registros
            </div>
            <div className="flex items-center space-x-2">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  pagination.currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-cyan-500 text-white hover:bg-cyan-600"
                }`}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                Anterior
              </button>
              <span className="text-sm text-gray-600">
                Página {pagination.currentPage} de {pagination.totalPages}
              </span>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  pagination.currentPage === pagination.totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
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
    </div>
  );
};

export default PaymentsTable;