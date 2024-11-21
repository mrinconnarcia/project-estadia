import createApiClient from "./apiClient";
import API_URLS from "./apiConfig";

const apiClient = createApiClient(API_URLS.POLICIES);
const search = createApiClient(API_URLS.SEARCH);

const policyService = {
  addPolicy: async (policyData) => {
    try {
      const response = await apiClient.post("/", policyData);
      return response.data;
    } catch (error) {
      console.error("Error adding policy", error);
      throw error;
    }
  },

  getAllPolicies: async (userId, page = 1) => {
    try {
      const response = await apiClient.get(
        `/polizas/user/${userId}?page=${page}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching policies", error);
      throw error;
    }
  },

  getPolicyDetails: async (policyId) => {
    try {
      const response = await apiClient.get(`/polizas/${policyId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching policy details", error);
      throw error;
    }
  },

  searchPolicies: async (userId, searchTerm, page = 1, limit = 5) => {
    try {
      const response = await search.get(`/users/${userId}/search/polizas`, {
        params: {
          q: searchTerm,
          page,
          limit,
        },
      });
      return {
        policies: response.data.policies || [],
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
        totalItems: response.data.totalItems,
      };
    } catch (error) {
      console.error("Error in searchPolicies:", error);
      throw error;
    }
  },

  deletePolicy: async (clientId, poliza_id) => {
    try {
      const response = await apiClient.delete(
        `/clientes/${clientId}/polizas/${poliza_id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting policy", error);
      throw error;
    }
  },

  // updatePolicy: async (clientId, policyId, policyData) => {
  //   try {
  //     const response = await apiClient.put(
  //       `/clientes/${clientId}/polizas/${policyId}`,
  //       policyData
  //     );
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error updating policy", error);
  //     throw error;
  //   }
  // },

  updatePolicy: async (policyId, policyData) => {
    try {
      const response = await apiClient.put(`/polizas/${policyId}`, policyData);
      return response.data.poliza;
    } catch (error) {
      console.error("Full error details:", error);

      if (error.response) {
        console.error("Server error response:", error.response.data);

        if (error.response.data.errors) {
          throw new Error(
            Object.values(error.response.data.errors).flat().join(", ")
          );
        }

        // Si hay un mensaje de error del servidor
        throw new Error(
          error.response.data.message || "Error al actualizar la póliza"
        );
      } else if (error.request) {
        throw new Error("No se recibió respuesta del servidor");
      } else {
        throw new Error("Error al configurar la solicitud");
      }
    }
  },

  downloadPolicyExcel: async (userId) => {
    try {
      const response = await apiClient.get(
        `/policies/download-excel/${userId}`,
        {
          responseType: "blob",
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );

      // Crear y descargar el archivo
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `polizas_${new Date().toISOString()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error("Error downloading policies Excel:", error);
      throw error;
    }
  },
};

export default policyService;
