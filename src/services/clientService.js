import createApiClient from './apiClient';
import API_URLS from './apiConfig';

const apiClient = createApiClient(API_URLS.CLIENTS);
const apiPolicies = createApiClient(API_URLS.POLICIES);
const search = createApiClient(API_URLS.SEARCH);
const notes = createApiClient(API_URLS.NOTES);

const clientService = {
  addClient: async ( userId, clientData) => {
    try {
      const response = await apiClient.post(`/${userId}/agregar`, clientData);
      return response.data;
    } catch (error) {
      console.error('Error adding client', error);
      throw error;
    }
  },

  addClientPolicy: async (clientId, policyData, pdfFile) => {
    try {
      const formData = new FormData();
      
      // Agregar los datos de la póliza al FormData
      Object.keys(policyData).forEach(key => {
        formData.append(key, policyData[key]);
      });
      
      // Agregar el archivo PDF si existe
      if (pdfFile) {
        formData.append('archivo_pdf', pdfFile, pdfFile.name);
      }
  
      // Realizar la solicitud POST
      const response = await apiPolicies.post(`/clientes/${clientId}/polizas`, formData);
  
      if (response.status === 201) {
        console.log('Policy added successfully');
        return response.data;
      } else {
        throw new Error('Unexpected response status: ' + response.status);
      }
    } catch (error) {
      console.error('Error adding client policy:', error.response?.data || error.message);
      throw error;
    }
  },
  
  getAllClients: async (userId, page = 1, limit = 5) => {
    try {
      const response = await apiClient.get(`/${userId}`, {
        params: { page, limit }
      });
      return {
        clients: response.data.clients || [],
        totalPages: response.data.totalPages || 1
      };
    } catch (error) {
      console.error('Error fetching clients', error);
      throw error;
    }
  },

  updateClient: async (userId, clientId, updatedData) => {
    try {
      const response = await apiClient.put(`/${userId}/editar/${clientId}`, updatedData);
      return response.data;
    } catch (error) {
      console.error('Error updating client', error);
      throw error;
    }
  },

  searchClients: async (searchTerm) => {
    try {
      const response = await search.get(`/clientes?q=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching clients', error);
      throw error;
    }
  },

  searchHome: async (searchTerm) => {
    try {
      const response = await search.get(`/buscar?q=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching', error);
      throw error;
    }
  },

  getClientDetails: async (userId, clientId) => {
    try {
      const response = await apiClient.get(`/${userId}/${clientId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching client details', error);
      throw error;
    }
  },

  downloadClientsExcel: async (userId) => {
    try {
      const response = await apiClient.get(`/${userId}/exportar/todos`, {
        responseType: 'blob', // Important: This tells axios to treat the response as binary data
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading clients Excel', error);
      throw error;
    }
  },
  
  getClientPolicies: async (clientId, page = 1, limit = 5) => {
    try {
      const response = await apiPolicies.get(`/clientes/${clientId}/polizas`, {
        params: {
          page,
          limit,
        },
      });
      return {
        polices: response.data.polizas || [],
        totalPages: response.data.totalPages || 1
      };
      // return response.data;
    } catch (error) {
      console.error('Error fetching client policies', error);
      throw error;
    }
  },
  

  getClientPayments: async (clientId) => {
    try {
      const response = await apiClient.get(`/${clientId}/payments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching client payments', error);
      throw error;
    }
  },

  getClientNotes: async (clientId) => {
    try {
      console.log(`Solicitando notas para el cliente ID: ${clientId}`);
      const response = await notes.get(`/nota/clientes/${clientId}/buscar`);
      console.log("Respuesta cruda de la API:", response);
      console.log("Datos de la respuesta:", response.data);
      return response.data; // Asegúrese de que esto devuelve el array de notas
    } catch (error) {
      console.error('Error al obtener las notas del cliente', error);
      throw error;
    }
  },


  addClientNote: async (clientId, noteContent) => {
    try {
      const response = await notes.post(`/nota/clientes/${clientId}/crear`, { contenido: noteContent });
      return response.data;
    } catch (error) {
      console.error('Error adding client note', error);
      throw error;
    }
  },
};

export default clientService;
