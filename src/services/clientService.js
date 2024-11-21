import createApiClient from "./apiClient";
import API_URLS from "./apiConfig";

const apiClient = createApiClient(API_URLS.CLIENTS);
const apiPolicies = createApiClient(API_URLS.POLICIES);
const search = createApiClient(API_URLS.SEARCH);
const notes = createApiClient(API_URLS.NOTES);

const clientService = {
  addClient: async (userId, clientData) => {
    try {
      const response = await apiClient.post(
        `/${userId}/clients/add`,
        clientData
      );
      return response.data;
    } catch (error) {
      console.error("Error adding client", error);
      throw error;
    }
  },

  addClientPolicy: async (clientId, policyData, pdfFile) => {
    try {
      const formData = new FormData();

      // Agregar los datos de la póliza al FormData
      Object.keys(policyData).forEach((key) => {
        formData.append(key, policyData[key]);
      });

      // Agregar el archivo PDF si existe
      if (pdfFile) {
        formData.append("archivo_pdf", pdfFile, pdfFile.name);
      }

      // Realizar la solicitud POST
      const response = await apiPolicies.post(
        `/clientes/${clientId}/polizas`,
        formData
      );

      if (response.status === 201) {
        console.log("Policy added successfully");
        return response.data;
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error) {
      console.error(
        "Error adding client policy:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getAllClients: async (userId, page = 1, limit = 5) => {
    try {
      const response = await apiClient.get(`/${userId}/clients`, {
        params: { page, limit },
      });

      // Adaptador para manejar la respuesta de Laravel
      return {
        clients: response.data.data || [], // Laravel paginate pone los resultados en data
        totalPages:
          Math.ceil(response.data.total / response.data.per_page) || 1,
      };
    } catch (error) {
      console.error("Error fetching clients", error);
      throw error;
    }
  },

  updateClient: async (userId, clientId, updatedData) => {
    try {
      const response = await apiClient.put(
        `/${userId}/clients/${clientId}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating client", error);
      throw error;
    }
  },

  searchHome: async (userId, searchTerm, page = 1, limit = 5) => {
    try {
      const response = await search.get(`/users/${userId}/search/buscar`, {
        params: {
          q: searchTerm,
          page,
          limit,
        },
      });
      return {
        clients: response.data.clients || [],
        policies: response.data.policies || [],
        totalClients: response.data.totalClients,
        totalPolicies: response.data.totalPolicies,
        currentPage: response.data.currentPage,
        totalPagesClients: response.data.totalPagesClients,
        totalPagesPolicies: response.data.totalPagesPolicies,
      };
    } catch (error) {
      console.error("Error in searchHome:", error);
      throw error;
    }
  },

  searchClients: async (userId, searchTerm, page = 1, limit = 5) => {
    try {
      const response = await search.get(`/users/${userId}/search/clientes`, {
        params: {
          q: searchTerm,
          page,
          limit,
        },
      });
      return {
        clients: response.data.clients || [],
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
        totalItems: response.data.totalItems,
      };
    } catch (error) {
      console.error("Error in searchClients:", error);
      throw error;
    }
  },

  getClientDetails: async (userId, clientId) => {
    try {
      const response = await apiClient.get(`/${userId}/clients/${clientId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching client details", error);
      throw error;
    }
  },

   downloadClientsExcel: async (userId) => {
    try {
      const response = await apiClient.get(`/download-excel/${userId}`, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      });
  
      // Crear y descargar el archivo
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `clientes_${new Date().toISOString()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error("Error downloading clients Excel:", error);
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
        polizas: response.data.polizas || [],
        totalPages: response.data.totalPages || 1,
        currentPage: response.data.currentPage || 1,
      };
    } catch (error) {
      console.error("Error fetching client policies", error);
      throw error;
    }
  },

  getClientPayments: async (clientId) => {
    try {
      const response = await apiClient.get(`/${clientId}/payments`);
      return response.data;
    } catch (error) {
      console.error("Error fetching client payments", error);
      throw error;
    }
  },

  getClientNotes: async (clientId) => {
    try {
      console.log(`Solicitando notas para el cliente ID: ${clientId}`);
      const response = await notes.get(`/${clientId}/notas`);
      console.log("Respuesta cruda de la API:", response);
      console.log("Datos de la respuesta:", response.data);
      return response.data; // Asegúrese de que esto devuelve el array de notas
    } catch (error) {
      console.error("Error al obtener las notas del cliente", error);
      throw error;
    }
  },

  addClientNote: async (clientId, noteContent) => {
    try {
      const response = await notes.post(`/${clientId}/notas`, {
        contenido: noteContent,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding client note", error);
      throw error;
    }
  },
};

export default clientService;
