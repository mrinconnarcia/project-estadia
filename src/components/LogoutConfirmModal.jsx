import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = () => {
    authService.logout();
    onConfirm();
    onClose();
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="logout-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Confirmar Cierre de Sesión</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">¿Estás seguro de que quieres cerrar sesión?</p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="ok-btn"
              className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
            <button
              id="cancel-btn"
              className="mt-3 px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
