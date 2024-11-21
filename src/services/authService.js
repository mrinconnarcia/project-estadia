import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";

const authService = {
  login: async (email, password) => {
    const response = await axios.post(API_URL + "login", { email, password });
    if (response.data.token) {
      // Guardar el token por separado
      localStorage.setItem("token", response.data.token);
      // Guardar el resto de la información del usuario
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.data.user.id,
          name: response.data.user.name,
          last_name: response.data.user.last_name,
          email: response.data.user.email,
          profile_picture: response.data.user.profile_picture,
        })
      );
    }
    console.log("Token:", response.data.token);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  register: async (name, last_name, email, password) => {
    const response = await axios.post(API_URL + "register", {
      name,
      last_name,
      email,
      password,
    });
    return response.data;
  },

  // Solicitar restablecimiento de contraseña
  requestPasswordReset: async (email) => {
    try {
      const response = await axios.post(API_URL + "forgot-password", { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Restablecer contraseña con token
  resetPassword: async (email, password, password_confirmation, token) => {
    try {
      const response = await axios.post(API_URL + "reset-password", {
        email,
        password,
        password_confirmation,
        token
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateUser: async (userId, userData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      // Log the FormData contents
      console.log("FormData contents:");
      for (let pair of userData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      console.log("Sending request to:", `${API_URL}update/${userId}`);

      const response = await axios.post(
        `${API_URL}update/${userId}`,
        userData,
        config
      );
      console.log("Server response:", response.data);

      if (response.data.user) {
        const updatedUser = response.data.user;

        // Update localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));

        return updatedUser;
      } else {
        throw new Error("Invalid server response format");
      }
    } catch (error) {
      console.error("Error updating user:");
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }
      throw error;
    }
  },
  // Método auxiliar para obtener el token
  getToken: () => {
    return localStorage.getItem("token");
  },

  // // Método auxiliar para verificar si el usuario está autenticado
  // isAuthenticated: () => {
  //   return !!localStorage.getItem("token");
  // },
};

export default authService;
