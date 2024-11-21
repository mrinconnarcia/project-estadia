import createApiClient from "./apiClient";
import API_URLS from "./apiConfig";

const apiClient = createApiClient(API_URLS.PAYMENTS);

// Tipos de respuesta esperados
const DEFAULT_PAGINATION = {
  pagos: [],
  totalPages: 1,
  currentPage: 1,
  perPage: 5,
  total: 0,
};

const paymentService = {
  getPayments: async (userId, page = 1, limit = 5) => {
    if (!userId) throw new Error("User ID is required");

    try {
      const response = await apiClient.get(`/usuarios/${userId}/pagos`, {
        params: { page, limit },
      });

      // Validación de la estructura de la respuesta
      if (!response.data || !Array.isArray(response.data.pagos)) {
        throw new Error("Invalid server response format");
      }

      return {
        ...DEFAULT_PAGINATION,
        ...response.data,
      };
    } catch (error) {
      console.error("Error fetching payments:", error);
      throw new Error(
        error.response?.data?.message || "Error al obtener los pagos"
      );
    }
  },

  getPaymentsByPoliza: async (polizaId, currentPage = 1, limit = 5) => {
    if (!polizaId) throw new Error("Policy ID is required");

    try {
      const response = await apiClient.get(`/polizas/${polizaId}/pagos`, {
        params: {
          page: currentPage,
          limit,
        },
      });

      // Validación de la estructura de la respuesta
      if (!response.data || !Array.isArray(response.data.pagos)) {
        throw new Error("Invalid server response format");
      }

      // Devolvemos la estructura exacta que viene del backend
      return {
        pagos: response.data.pagos,
        total_pages: response.data.total_pages,
        current_page: response.data.current_page,
        total: response.data.total,
      };
    } catch (error) {
      console.error("Error fetching policy payments:", error);
      throw new Error(
        error.response?.data?.message ||
          "Error al obtener los pagos de la póliza"
      );
    }
  },

  createPayment: async (polizaId, paymentData) => {
    if (!polizaId) throw new Error("Policy ID is required");
    if (!paymentData || typeof paymentData !== "object") {
      throw new Error("Invalid payment data");
    }

    try {
      const response = await apiClient.post(
        `/polizas/${polizaId}/pagos`,
        paymentData
      );

      if (!response.data) {
        throw new Error("Invalid server response");
      }

      return response.data;
    } catch (error) {
      console.error("Error creating payment:", error);
      throw new Error(
        error.response?.data?.message || "Error al crear el pago"
      );
    }
  },

  getClientDetails: async (polizaId, page = 1, limit = 5) => {
    if (!polizaId) throw new Error("Policy ID is required");

    try {
      const response = await apiClient.get(`/poliza/${polizaId}`, {
        params: {
          page,
          limit,
        },
      });

      if (!response.data) {
        throw new Error("Invalid server response format");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching client details:", error);
      throw new Error(
        error.response?.data?.message || "Error al obtener detalles del cliente"
      );
    }
  },
};

export default paymentService;
