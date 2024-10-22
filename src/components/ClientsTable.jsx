import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Plus, Download, Search } from "lucide-react";
import ClientModal from "./ClientModal";
import clientService from "../services/clientService";

const ClientsTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserId(user.id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchClients = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const { clients, totalPages } = await clientService.getAllClients(
        userId,
        currentPage,
        limit
      );
      setClients(clients);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setError("Error al obtener clientes. Por favor, intente de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [userId, currentPage, limit]);

  useEffect(() => {
    if (userId) {
      fetchClients();
    }
  }, [fetchClients, userId]);

  const searchClients = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const { clients, totalPaginas } = await clientService.searchClients(
          searchTerm,
          page,
          limit
        );
        setClients(clients);
        setTotalPages(totalPaginas);
      } catch (error) {
        setError("Error searching clients");
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, limit]
  );

  const handleDownloadExcel = async () => {
    try {
      if (!userId) return;
      const blob = await clientService.downloadClientsExcel(userId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'clientes.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading Excel file:", error);
      // You can add error handling here, such as displaying an error message to the user
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const delayDebounceFn = setTimeout(() => {
        searchClients(currentPage);
      }, 300); // Debounce para la búsqueda
      return () => clearTimeout(delayDebounceFn);
    } else {
      fetchClients(currentPage);
    }
  }, [searchTerm, currentPage, fetchClients, searchClients]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleOpenAddModal = () => {
    setIsAdding(true);
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  const handleViewClient = async (clientId) => {
    try {
      if (!userId) return;  // Asegúrate de que haya un userId disponible
      const clientDetails = await clientService.getClientDetails(userId, clientId);
      navigate(`/client-details/${clientId}`, { state: { clientDetails } });
    } catch (error) {
      console.error("Error fetching client details:", error);
      // Aquí puedes mostrar un mensaje de error si lo deseas
    }
  };
  

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">CLIENTES</h1>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div className="relative flex-grow mr-4">
          <input
            type="text"
            placeholder="Buscar cliente..."
            className="w-full pl-10 pr-4 py-2 border rounded-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute top-2 left-3 text-gray-500" />
        </div>

        <button
          className="bg-cyan-500 text-white py-2 px-4 rounded-full flex items-center gap-2 hover:bg-cyan-600 mr-2"
          onClick={handleOpenAddModal}
        >
          <Plus className="w-4 h-4" />
          Agregar Cliente
        </button>

        <button
          className="bg-gray-500 text-white py-2 px-4 rounded-full flex items-center gap-2 hover:bg-gray-600 mr-2"
          onClick={handleDownloadExcel}
        >
          <Download className="w-4 h-4" />
          Descargar Excel
        </button>
      </div>

      {loading ? (
        <p className="text-center py-4">Cargando clientes...</p>
      ) : error ? (
        <p className="text-center text-red-500 py-4">{error}</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">#</th>
                  <th className="py-2 px-4 text-left">NOMBRE</th>
                  <th className="py-2 px-4 text-left">TEL/CEL</th>
                  <th className="py-2 px-4 text-left">CORREO</th>
                  <th className="py-2 px-4 text-left">ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {clients.length > 0 ? (
                  clients.map((client, index) => (
                    <tr
                      key={client.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="py-2 px-4">
                        {index + 1 + (currentPage - 1) * limit}
                      </td>
                      <td className="py-2 px-4">
                        {client.nombre} {client.apellidos}
                      </td>
                      <td className="py-2 px-4">{client.telefono}</td>
                      <td className="py-2 px-4">{client.correo}</td>
                      <td className="py-2 px-4">
                        <button
                          className="text-gray-500 hover:text-cyan-600 transition"
                          onClick={() => handleViewClient(client.id)}
                        >
                          <Eye />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No hay clientes disponibles.
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

      {isModalOpen && (
        <ClientModal
          client={selectedClient}
          isAdding={isAdding}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ClientsTable;
