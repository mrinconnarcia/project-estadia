import createApiClient from "./apiClient";
import API_URLS from "./apiConfig";

const apiClient = createApiClient(API_URLS.PAYMENTS);

const paymentService = {
  getPayments: async ( page = 1, limit = 5) => {
    try {
      const response = await apiClient.get(`/todos/pagos`, {
        params: { page, limit }, // Aquí pasamos los parámetros de paginación
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching payments", error);
      throw error;
    }
  },

  getPaymentsByPoliza: async (polizaId, currentPage) => {
    try {
      const response = await apiClient.get(`/polizas/${polizaId}/pagos`, {
        params: { page: currentPage },
      });
      console.log("Respuesta del servidor en el servicio:", response.data); // Para depuración
      if (response.data && response.data.pagos) {
        return response.data;
      } else {
        throw new Error("Formato de respuesta del servidor inesperado");
      }
    } catch (error) {
      console.error("Error al obtener los pagos de la póliza", error);
      throw error;
    }
  },

  createPayment: async (polizaId, paymentData) => {
    try {
      const response = await apiClient.post(
        `/polizas/${polizaId}/pagos`,
        paymentData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating payment", error);
      throw error;
    }
  },
};

export default paymentService;
