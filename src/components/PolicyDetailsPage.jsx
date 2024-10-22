import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit2 } from 'lucide-react';
import policyService from '../services/policyService';
import EditPolicyModal from './EditPolicyModal';

export default function PolicyDetailsPage() {
  const { policyId } = useParams();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPolicyDetails = async () => {
      try {
        const data = await policyService.getPolicyDetails(policyId);
        setPolicy(data);
      } catch (err) {
        setError('Error al cargar los detalles de la póliza');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicyDetails();
  }, [policyId]);

  const handleUpdatePolicy = async (updatedPolicy) => {
    try {
      const result = await policyService.updatePolicy(policyId, updatedPolicy);
      setPolicy(result);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error al actualizar la póliza', err);
      // Manejar el error apropiadamente (por ejemplo, mostrar un mensaje al usuario)
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!policy) return <NotFound message="No se encontró la póliza" />;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between items-center">
              <Link
                to="/policies"
                className="flex items-center text-sm font-medium text-cyan-600 hover:text-cyan-800 transition-colors duration-200"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a la lista de pólizas
              </Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors duration-200"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Editar
              </button>
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <PolicyDetailItem label="No. Poliza" value={policy.id} />
              <PolicyDetailItem label="Tipo de seguro" value={policy.tipo_seguro} />
              <PolicyDetailItem label="Prima neta" value={`$${policy.prima_neta}`} />
              {/* <PolicyDetailItem label="Cliente" value={policy.cliente} /> */}
              <PolicyDetailItem label="Asegurado" value={policy.asegurado} />
              <PolicyDetailItem label="Aseguradora" value={policy.aseguradora} />
              <PolicyDetailItem 
                label="Vigencia" 
                value={`${new Date(policy.vigencia_de).toLocaleDateString()} al ${new Date(policy.vigencia_hasta).toLocaleDateString()}`} 
              />
              <PolicyDetailItem label="Periodicidad de pago" value={policy.periodicidad_pago} />
            </dl>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <EditPolicyModal
          policy={policy}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleUpdatePolicy}
        />
      )}
    </div>
  );
}

function PolicyDetailItem({ label, value }) {
  return (
    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value}</dd>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">Error</h2>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

function NotFound({ message }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">No encontrado</h2>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}