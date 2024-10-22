import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const PasswordResetForm = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await resetPassword(email);
        setSuccess(true);
      } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        setErrors({ form: 'Error al enviar el correo de restablecimiento. Por favor, inténtalo de nuevo.' });
      }
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">Correo enviado</h3>
        <p className="mt-2 text-sm text-gray-600">
          Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
        </div>
      </div>

      {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
        >
          Restablecer contraseña
        </button>
      </div>
    </form>
  );
};

export default PasswordResetForm;