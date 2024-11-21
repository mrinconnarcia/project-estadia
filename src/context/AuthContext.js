import React, { createContext, useState, useEffect } from "react";
import authService from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (token && storedUser) {
        setUser(storedUser);
        // Opcional: Verificar el token con el backend aquí
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const register = async (name, last_name, email, password) => {
    try {
      const data = await authService.register(name, last_name, email, password);
      return data;
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      const response = await authService.requestPasswordReset(email);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email, password, password_confirmation, token) => {
    try {
      const response = await authService.resetPassword(email, password, password_confirmation, token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, requestPasswordReset, resetPassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
