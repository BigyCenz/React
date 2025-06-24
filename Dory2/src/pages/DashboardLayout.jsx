import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Divider } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>

      {/* Sidebar */}

      <Box sx={{ width: 240, bgcolor: '#1976d2', color: 'white', p: 2 }}>

         <Typography variant="h6" gutterBottom>
          {user?.gestore || 'Gestore sconosciuto'}
        </Typography>

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Benvenuto, {user?.username}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          Ruolo: {user?.role}
        </Typography>

        <Divider sx={{ my: 2, borderColor: 'white' }} />

        <Button fullWidth sx={{ color: 'white' }} onClick={() => navigate('/dashboard')}>Home</Button>
        <Button fullWidth sx={{ color: 'white' }} onClick={() => navigate('/dashboard/clienti')}>Clienti</Button>
        <Button fullWidth sx={{ color: 'white' }} onClick={() => navigate('/dashboard/locations')}>Locations</Button>
        <Button fullWidth sx={{ color: 'white' }} onClick={() => navigate('/dashboard/categorie')}>Categorie</Button>
        <Button fullWidth sx={{ color: 'white' }} onClick={logout}>Logout</Button>
      </Box>

      {/* Contenuto dinamico */}
      <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
