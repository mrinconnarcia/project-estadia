import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import PasswordResetPage from "./pages/ResetPassword";
import NewPassword from "./pages/NewPassword";

// Movemos PrivateRoute dentro de un componente funcional para usar useAuth
const PrivateRouteWrapper = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; // O un componente de carga
  }
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<PasswordResetPage />} />
          <Route path="/reset-password" element={<NewPassword />} />
          <Route
            path="/*"
            element={
              <PrivateRouteWrapper>
                <MainLayout />
              </PrivateRouteWrapper>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;