import React, { useState, useEffect, useCallback } from "react";
import { Eye, Download, Search, Upload } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import NewPolicyModal from "./NewPolicyModal";
import policyService from "../services/policyService";
import FileUpload from "./FileUpload";
import { Link } from "react-router-dom";

const PoliciesList = () => {
  const [isNewPolicyModalOpen, setIsNewPolicyModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [limit] = useState(5);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
      setUserId(storedUser.id);
    }
  }, []);

  const fetchPolicies = useCallback(
    async (page) => {
      if (!userId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await policyService.getAllPolicies(userId, page, limit);
        setPolicies(data.data || []);
        setTotalPages(data.last_page || 1);
      } catch (error) {
        console.error("Error fetching policies", error);
        setError("Error al obtener pólizas. Por favor, intente de nuevo.");
      } finally {
        setLoading(false);
      }
    },
    [userId, limit]
  );

  useEffect(() => {
    fetchPolicies(currentPage);
  }, [fetchPolicies, currentPage]);

  const searchPolicies = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const { policies, totalPages } = await policyService.searchPolicies(
          userId,
          searchTerm,
          page,
          limit
        );
        setPolicies(policies);
        setTotalPages(totalPages);
      } catch (error) {
        setError("Error searching policies");
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, limit]
  );

  useEffect(() => {
    if (searchTerm) {
      const delayDebounceFn = setTimeout(() => {
        searchPolicies(currentPage);
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      fetchPolicies(currentPage);
    }
  }, [searchTerm, currentPage, fetchPolicies, searchPolicies]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleAddPolicy = async (newPolicy) => {
    try {
      const addedPolicy = await policyService.addPolicy(newPolicy);
      setPolicies((prev) => [...prev, addedPolicy]);
      setIsNewPolicyModalOpen(false);
      toast.success("Póliza agregada exitosamente");
    } catch (error) {
      console.error("Error adding policy", error);
      toast.error("Error al agregar la póliza. Por favor, intente de nuevo.");
    }
  };

  const handleDownloadExcel = async () => {
    try {
      await policyService.downloadPolicyExcel(userId);
      // Opcional: mostrar mensaje de éxito
      toast.success("Excel descargado correctamente");
    } catch (error) {
      console.error("Error downloading Excel:", error);
      // Mostrar mensaje de error
      toast.error("Error al descargar el Excel");
    }
  };
  
  const handleFileUpload = async (files) => {
    setIsUploading(true);
    const uploadPromises = files.map((file) => uploadFile(file));

    try {
      await Promise.all(uploadPromises);
      toast.success(
        `${files.length} archivo${files.length > 1 ? "s" : ""} subido${
          files.length > 1 ? "s" : ""
        } exitosamente`
      );
      setIsUploadModalOpen(false);
      fetchPolicies(currentPage);
    } catch (error) {
      console.error("Error uploading files", error);
      toast.error("Error al subir los archivos. Por favor, intente de nuevo.");
    } finally {
      setIsUploading(false);
    }
  };

  const uploadFile = async (file) => {
    // Simulating file upload
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Here you would normally send the file to your server
    // const response = await policyService.uploadFile(file);
    // return response;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">PÓLIZAS</h1>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div className="relative flex-grow mr-4">
          <input
            type="text"
            placeholder="Buscar póliza..."
            className="w-full pl-10 pr-4 py-2 border rounded-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute top-2 left-3 text-gray-500" />
        </div>

        {/* <button
          className="bg-cyan-500 text-white px-4 py-2 rounded-full flex items-center gap-2 mr-2 hover:bg-cyan-600 transition-colors"
          onClick={() => setIsNewPolicyModalOpen(true)}
        >
          <Plus className="mr-2" /> Agregar
        </button> */}

        <button
          className="bg-green-500 text-white py-2 px-4 rounded-full flex items-center gap-2 hover:bg-green-600 mr-2"
          onClick={() => setIsUploadModalOpen(true)}
        >
          <Upload className="w-4 h-4" />
          Subir
        </button>

        <button
          className="bg-gray-500 text-white py-2 px-4 rounded-full flex items-center gap-2 hover:bg-gray-600"
          onClick={handleDownloadExcel}
        >
          <Download className="w-4 h-4" />
          Descargar Excel
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
                  <th className="py-2 px-4 text-left">#</th>
                  <th className="py-2 px-4 text-left">POLIZA</th>
                  <th className="py-2 px-4 text-left">ASEGURADORA</th>
                  <th className="py-2 px-4 text-left">ASEGURADO</th>
                  <th className="py-2 px-4 text-left">VENCIMIENTO</th>
                  <th className="py-2 px-4 text-left">ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {policies.length > 0 ? (
                  policies.map((policy, index) => (
                    <tr
                      key={policy.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="py-2 px-4">
                        {index + 1 + (currentPage - 1) * limit}
                      </td>
                      <td className="py-2 px-4">{policy.tipo_seguro}</td>
                      <td className="py-2 px-4">{policy.aseguradora}</td>
                      <td className="py-2 px-4">{policy.asegurado}</td>
                      <td className="py-2 px-4">
                        {new Date(policy.vigencia_hasta).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4">
                        <Link
                          to={`/policy/${policy.id}`}
                          className="text-gray-500 hover:text-cyan-600 transition"
                        >
                          <Eye />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No hay pólizas disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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
        </>
      )}

      {/* New Policy Modal */}
      <NewPolicyModal
        isOpen={isNewPolicyModalOpen}
        onClose={() => setIsNewPolicyModalOpen(false)}
        onSave={handleAddPolicy}
      />

      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Subir Archivos</h2>
            <FileUpload
              onFileUpload={handleFileUpload}
              isUploading={isUploading}
            />
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors mr-2"
                onClick={() => setIsUploadModalOpen(false)}
                disabled={isUploading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoliciesList;
