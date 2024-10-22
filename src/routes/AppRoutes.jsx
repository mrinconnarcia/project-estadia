import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ClientsPage from '../pages/Clientes';
import PoliciesPage from '../pages/Polizas';
import PaymentsPage from '../pages/Pagos';
import NotFoundPage from '../pages/NotFoundPage';
import Home from '../pages/Home';
import ClientDetails from '../components/ClientDetails';
import PrivateRoute from './PrivateRoute';
import PaymentsTable from '../components/PaymentsTable';
import PolicyListByClient from '../components/PolicyListByClient';
import PolicyDetailsPage from '../components/PolicyDetailsPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/clients" element={<PrivateRoute><ClientsPage /></PrivateRoute>} />
      <Route path="/policies" element={<PrivateRoute><PoliciesPage /></PrivateRoute>} />
      <Route path="/payments" element={<PrivateRoute><PaymentsPage /></PrivateRoute>} />
      <Route path="/client-details/:clientId" element={<PrivateRoute><ClientDetails /></PrivateRoute>} />
      <Route path="/client/:clientId/policies" element={<PrivateRoute><PolicyListByClient /></PrivateRoute>} />
      <Route path="/policy/:policyId/payments" element={<PrivateRoute><PaymentsTable /></PrivateRoute>} />
      <Route path="/policy/:policyId" element={<PrivateRoute><PolicyDetailsPage /></PrivateRoute>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;