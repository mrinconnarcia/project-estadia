import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-extrabold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mb-8">Página no encontrada</h2>
      <p className="text-gray-500 mb-8">
        Lo sentimos, la página que estás buscando no existe.
      </p>
      <a
        href="/"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
      >
        Volver al inicio
      </a>
    </div>
  );
};

export default NotFoundPage;