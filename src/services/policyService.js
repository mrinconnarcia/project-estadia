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

  getAllPolicies: async (page = 1) => {
    try {
      const response = await apiClient.get(`/polizas/?page=${page}`);
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

  searchPolicies: async (searchTerm) => {
    try {
      const response = await search.get(
        `/polizas?q=${encodeURIComponent(searchTerm)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error searching policies", error);
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

  updatePolicy: async (clientId, policyId, policyData) => {
    try {
      const response = await apiClient.put(`/clientes/${clientId}/polizas/${policyId}`, policyData);
      return response.data;
    } catch (error) {
      console.error("Error updating policy", error);
      throw error;
    }
  },

  downloadPolicyExcel: async (userId) => {
    try {
      const response = await apiClient.get(`/export-policies/${userId}`, {
        responseType: "blob",
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error downloading Excel", error);
      throw error;
    }
  },
};

export default policyService;
