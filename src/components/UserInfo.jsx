import React, { useState, useEffect } from 'react';
import { UserCircle, Edit, LogOut, ChevronDown } from 'lucide-react';

const UserInfo = ({ user, onOpenEditModal, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (user && user.name) {
      setUserName(user.name);
    }
  }, [user]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
      >
        {user && user.profile_picture ? (
          <img
            src={user.profile_picture}
            alt={userName}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <UserCircle className="w-8 h-8" />
        )}
        <span>{userName}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <button
            onClick={() => {
              onOpenEditModal();
              setIsMenuOpen(false);
            }}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 transition-colors duration-200"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar Perfil
          </button>
          <button
            onClick={() => {
              onLogout();
              setIsMenuOpen(false);
            }}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 transition-colors duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInfo;