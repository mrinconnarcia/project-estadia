import React from 'react';
import ClientsTable from '../components/ClientsTable';

const Clientes = () => {
  return (
    <div>
      {/* <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Buscar..."
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="flex items-center space-x-4">
            <span>ANTONIO</span>
            <img
              src="/path-to-user-avatar.jpg"
              alt="Usuario"
              className="h-10 w-10 rounded-full"
            />
          </div>
        </header>
        <h1 className="text-2xl font-bold">Clientes</h1> */}
      <ClientsTable></ClientsTable>
    </div>
  );
};

export default Clientes;
