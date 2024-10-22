import React from 'react';
import { ArrowLeft } from 'lucide-react';

const PaymentDetailsView = ({ client, onBack }) => {
  const { name, amount, frequency, payments, poliza } = client;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center text-gray-600">
          <ArrowLeft size={20} className="mr-2" />
          CLIENTES
        </button>
        <div className="flex items-center">
          <img src="/api/placeholder/48/48" alt={name} className="w-12 h-12 rounded-full mr-4" />
          <div>
            <h2 className="text-xl font-semibold">{name}</h2>
            <h3 className="text-lg font-semibold mt-2">PAGOS</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Monto:</p>
          <p className="text-lg font-semibold">${amount}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Periodicidad:</p>
          <p className="text-lg font-semibold">{frequency}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Poliza</p>
          <p className="text-lg font-semibold">{poliza || '-'}</p>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-3 px-4 font-semibold">No. Pago</th>
            <th className="py-3 px-4 font-semibold">Fecha de pago</th>
            <th className="py-3 px-4 font-semibold">Estado de pago</th>
            <th className="py-3 px-4 font-semibold">Emision de pago</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={index} className="border-b">
              <td className="py-3 px-4">{payment.number}</td>
              <td className="py-3 px-4">{payment.date}</td>
              <td className="py-3 px-4">{payment.status}</td>
              <td className="py-3 px-4">{payment.issueDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentDetailsView;