import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
// import { useAuth } from './useAuth';

export const useUserActions = () => {
//   const { logout } = useAuth();
//   const navigate = useNavigate();

  const handleEditProfile = useCallback(() => {
    // Implementa la lógica para editar el perfil
    toast.success('Editando perfil...', {
      icon: '✏️',
    });
    // Aquí podrías navegar a la página de edición de perfil
    // navigate('/edit-profile');
  }, []);

  const handleLogout = useCallback(() => {
    // logout();
    toast.success('Sesión cerrada exitosamente', {
      icon: '👋',
    });
    // navigate('/login');
//   }, [logout, navigate]);
  }, []);

  return {
    handleEditProfile,
    handleLogout,
  };
};