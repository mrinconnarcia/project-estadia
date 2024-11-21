import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import ClientModal from './ClientModal';
import clientService from '../services/clientService';

const HomeTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchResults, setSearchResults] = useState({ clients: [], policies: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserId(user.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSearch = async () => {
    if (!userId) return;
    
    if (searchTerm) {
      setIsLoading(true);
      try {
        const results = await clientService.searchHome(userId, searchTerm);
        setSearchResults(results);
      } catch (error) {
        console.error('Error en la búsqueda:', error);
        // You could add error state handling here if needed
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchResults({ clients: [], policies: [] });
    }
  };

  useEffect(() => {
    if (searchTerm && userId) {
      const delayDebounceFn = setTimeout(() => {
        handleSearch();
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchTerm, userId]);



  const handleViewClient = (clientId) => {
    navigate(`/details/${clientId}`);
  };

  const handleViewPolicy = (policyId) => {
    console.log(`View policy with ID: ${policyId}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">HOME</h1>
      </div>

      <div className="mb-4 relative">
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 border rounded-md"
          placeholder="Buscar clientes o pólizas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" />
      </div>

      {isLoading ? (
        <p className="text-center">Cargando...</p>
      ) : (
        <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
          {searchResults.clients.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-2">Clients</h2>
              <table className="w-full mb-6">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Phone</th>
                    <th className="py-2 px-4 text-left">Email</th>
                    {/* <th className="py-2 px-4 text-left">Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {searchResults.clients.map((client) => (
                    <tr key={client.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-2 px-4">{`${client.nombre} ${client.apellidos}`}</td>
                      <td className="py-2 px-4">{client.telefono}</td>
                      <td className="py-2 px-4">{client.correo}</td>
                      {/* <td className="py-2 px-4">
                        <button
                          className="text-cyan-500 hover:text-cyan-600 transition-colors"
                          onClick={() => handleViewClient(client.id)}
                        >
                          <Eye />
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {searchResults.policies.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-2">Policies</h2>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Tipo</th>
                    <th className="py-2 px-4 text-left">Asegurado</th>
                    <th className="py-2 px-4 text-left">Vigencia</th>
                    {/* <th className="py-2 px-4 text-left">Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {searchResults.policies.map((policy) => (
                    <tr key={policy.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-2 px-4">{policy.tipo_seguro}</td>
                      <td className="py-2 px-4">{policy.asegurado}</td>
                      <td className="py-2 px-4">{new Date(policy.vigencia_hasta).toLocaleDateString()}</td>
                      {/* <td className="py-2 px-4">
                        <button
                          className="text-cyan-500 hover:text-cyan-600 transition-colors"
                          onClick={() => handleViewPolicy(policy.id)}
                        >
                          <Eye />
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {searchTerm && searchResults.clients.length === 0 && searchResults.policies.length === 0 && (
            <p className="text-center mt-4">No se encontraron resultados.</p>
          )}
        </div>
      )}

      {isModalOpen && (
        <ClientModal
          client={selectedClient}
          isAdding={isAdding}
          closeModal={() => setIsModalOpen(false)}
          onClientAdded={() => {
            setSearchTerm('');
            setSearchResults({ clients: [], policies: [] });
          }}
        />
      )}
    </div>
  );
};

export default HomeTable;