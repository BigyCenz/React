import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
//import LoginPage from './pages/LoginPage.jsx'
import Dashboard from './components/Dashboard.jsx'

const router = createBrowserRouter([
  {path: '/', element: <App />},
  {path: 'home', element: <Dashboard />},
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
