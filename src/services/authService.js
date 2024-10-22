import axios from "axios";

const API_URL = "https://zw30cmn4-3008.use2.devtunnels.ms/api/users/";

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

  resetPassword: async (email) => {
    const response = await axios.post(API_URL + "reset-password", { email });
    return response.data;
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

    const response = await axios.put(
      `${API_URL}update/${userId}`,
      userData,
      config
    );

    if (response.data && response.data.user) {
      const updatedUser = {
        id: response.data.user.id,
        name: response.data.user.name,
        last_name: response.data.user.last_name,
        email: response.data.user.email,
        profile_picture: response.data.user.profile_picture,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
    } else {
      console.error("No se encontraron datos de usuario en la respuesta.");
    }

    return response.data.user;
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
