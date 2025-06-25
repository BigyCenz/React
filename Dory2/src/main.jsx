import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import DashboardLayout from './pages/DashboardLayout.jsx';
import DashboardHome from './pages/DashboardHome.jsx';
import Clienti from './pages/Clienti.jsx';
import Location from './pages/Location.jsx';
import Categorie from './pages/Categorie.jsx';
import Macchine from './pages/Macchine.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { AuthProvider } from './context/AuthContext';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicRoute><App /></PublicRoute>,
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { path: '', element: <DashboardHome /> },
      { path: 'clienti', element: <Clienti /> },
      { path: 'locations', element: <Location /> },
      { path: 'categorie', element: <Categorie /> },
      { path: 'macchine', element: <Macchine /> }
    ]
  }
]);


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
