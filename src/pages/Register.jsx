import React from "react";
import { Link } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen items-center justify-center flex flex-col bg-gray-100">
      <main className="flex-col flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear una cuenta
          </h2>
        </div>
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <RegisterForm />
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
