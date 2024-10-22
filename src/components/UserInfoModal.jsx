import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import { toast, Toaster } from 'react-hot-toast';

const UserInfoModal = ({ isOpen, onClose, onSave }) => {
  const [editedUser, setEditedUser] = useState({ name: '', last_name: '', email: '' });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        setEditedUser({ name: user.name, last_name: user.last_name, email: user.email });
        setPreviewUrl(user.profile_picture || '');
      }
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const formData = new FormData();
      formData.append('name', editedUser.name);
      formData.append('last_name', editedUser.last_name);
      formData.append('email', editedUser.email);
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }

      const updatedUser = await authService.updateUser(user.id, formData);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      onSave(updatedUser);

      toast.success("Perfil actualizado exitosamente", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      toast.error("Error al actualizar el perfil. Intenta de nuevo.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error('Error updating user:', error);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Editar Perfil</h3>
          <form onSubmit={handleSubmit} className="mt-2 text-left">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Nombre</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                name="name"
                value={editedUser.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last_name">Apellidos</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="last_name"
                type="text"
                name="last_name"
                value={editedUser.last_name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Correo</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                name="email"
                value={editedUser.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profile_picture">Foto de Perfil</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="profile_picture"
                type="file"
                name="profile_picture"
                onChange={handleFileChange}
                accept="image/*"
              />
              {previewUrl && (
                <img src={previewUrl} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-md" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Guardar Cambios
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={onClose}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
        <Toaster position="top-center" />
      </div>
    </div>
  );
};

export default UserInfoModal;