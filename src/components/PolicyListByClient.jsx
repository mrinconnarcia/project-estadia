import React, { useState, useEffect, useCallback } from "react";
import { Eye, Trash2, CreditCard, Plus, FileText } from "lucide-react";
import clientService from "../services/clientService";
import policyService from "../services/policyService";
import ConfirmationModal from "./ConfirmationModalDeletePolice";
import NewPolicyModal from "./NewPolicyModal";
import CreatePaymentModal from "./CreatePaymentModal";
import PaymentsTable from "./PaymentsTable";
import { CircleUserRound } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const PolicyListByClient = ({ clientId, clientName, onBack }) => {
  const [polizas, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState(null);
  const [isNewPolicyModalOpen, setIsNewPolicyModalOpen] = useState(false);
  const [isCreatePaymentModalOpen, setIsCreatePaymentModalOpen] =
    useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const [error, setError] = useState(null);
  const [limit] = useState(5);
  const [isPolicyDetailsModalOpen, setIsPolicyDetailsModalOpen] =
    useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const navigate = useNavigate();

  const fetchPolicies = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Usa la variable local `currentPage` dentro del bloque de `try`
      const response = await clientService.getClientPolicies(clientId, currentPage, limit);
      
      setPolicies(response.polizas);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (error) {
      console.error("Error al obtener pólizas:", error);
      setError("Error al obtener pólizas. Por favor, intente de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [clientId, limit]);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const openDeleteModal = (policy) => {
    setPolicyToDelete(policy);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPolicyToDelete(null);
  };

  const handleDeletePolicy = async () => {
    if (policyToDelete.id) {
      try {
        await policyService.deletePolicy(clientId, policyToDelete.id);
        toast.success("Póliza eliminada correctamente");
        fetchPolicies();
        closeDeleteModal();
      } catch (error) {
        console.error("Error deleting policy:", error);
        setError("Error al eliminar la póliza. Por favor, intente de nuevo.");
        toast.error(
          "Error al eliminar la póliza. Por favor, intente de nuevo."
        );
      }
    }
  };

  const openNewPolicyModal = () => {
    setIsNewPolicyModalOpen(true);
  };

  const closeNewPolicyModal = () => {
    setIsNewPolicyModalOpen(false);
  };

  const handleSaveNewPolicy = async (formData) => {
    try {
      await fetchPolicies(); // Refresh the polizas list
      toast.success("Póliza agregada correctamente");
      closeNewPolicyModal();
    } catch (error) {
      console.error("Error adding new policy:", error);
      setError("Error al agregar nueva póliza. Por favor, intente de nuevo.");
      toast.error(
        "Error al agregar nueva póliza. Por favor, intente de nuevo."
      );
    }
  };

  const openCreatePaymentModal = (policyId) => {
    setSelectedPolicyId(policyId);
    setIsCreatePaymentModalOpen(true);
  };

  const closeCreatePaymentModal = () => {
    setIsCreatePaymentModalOpen(false);
    setSelectedPolicyId(null);
  };

  const handlePaymentCreated = () => {
    fetchPolicies();
    closeCreatePaymentModal();
  };

  const openPolicyDetails = (policyId) => {
    navigate(`/policy/${policyId}/payments`);
  };

  const closePolicyDetailsModal = () => {
    setIsPolicyDetailsModalOpen(false);
    setSelectedPolicyId(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">POLIZAS</h1>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <CircleUserRound className="w-24 h-24 rounded-full mr-6 border-4 border-white shadow-lg" />
        <h2 className="text-xl font-semibold">{clientName}</h2>
      </div>

      <div className="flex justify-between mb-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
        >
          Volver
        </button>
        <button
          onClick={openNewPolicyModal}
          className="px-4 py-2 bg-cyan-500 text-white rounded-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Agregar Póliza
        </button>
      </div>

      {loading ? (
        <p className="text-center py-4">Cargando pólizas...</p>
      ) : error ? (
        <p className="text-center text-red-500 py-4">{error}</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">No. Folio</th>
                  <th className="py-2 px-4 text-left">Tipo de Seguro</th>
                  <th className="py-2 px-4 text-left">Prima Neta</th>
                  <th className="py-2 px-4 text-left">Asegurado</th>
                  <th className="py-2 px-4 text-left">Vigencia</th>
                  <th className="py-2 px-4 text-left">Periodicidad de Pago</th>
                  <th className="py-2 px-4 text-left">Acción</th>
                </tr>
              </thead>
              <tbody>
                {polizas.length > 0 ? (
                  polizas.map((policy) => (
                    <tr
                      key={policy.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="py-2 px-4">{policy.id}</td>
                      <td className="py-2 px-4">{policy.tipo_seguro}</td>
                      <td className="py-2 px-4">${policy.prima_neta}</td>
                      <td className="py-2 px-4">{policy.asegurado}</td>
                      <td className="py-2 px-4">
                        {new Date(policy.vigencia_de).toLocaleDateString()} -
                        {new Date(policy.vigencia_hasta).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4">{policy.periodicidad_pago}</td>
                      <td className="py-2 px-4">
                        <div className="flex space-x-2">
                          <button
                            className="flex items-center px-3 py-1 text-sm bg-cyan-100 text-cyan-700 rounded-md hover:bg-cyan-200 transition-colors duration-200 ease-in-out"
                            onClick={() => openPolicyDetails(policy.id)}
                            title="Ver pagos"
                          >
                            <FileText size={16} className="mr-1" />
                            <span>Pagos</span>
                          </button>
                          <button
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors duration-200 ease-in-out"
                            onClick={() => openDeleteModal(policy)}
                            title="Eliminar póliza"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No hay pólizas disponibles para este cliente.
                    </td>
                  </tr>
                )}
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

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeletePolicy}
        message={`¿Estás seguro de que quieres eliminar la póliza ${policyToDelete?.id}?`}
      />

      <NewPolicyModal
        isOpen={isNewPolicyModalOpen}
        onClose={closeNewPolicyModal}
        onSave={handleSaveNewPolicy}
        clientId={clientId} // Pass clientId as a prop
      />

      {isCreatePaymentModalOpen && (
        <CreatePaymentModal
          polizaId={selectedPolicyId}
          onClose={closeCreatePaymentModal}
          onPaymentCreated={handlePaymentCreated}
        />
      )}

      {isPolicyDetailsModalOpen && (
        <PaymentsTable
          polizaId={selectedPolicyId}
          isOpen={isPolicyDetailsModalOpen}
          onClose={closePolicyDetailsModal}
        />
      )}
    </div>
  );
};

export default PolicyListByClient;
