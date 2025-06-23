import React from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          bgcolor: '#1976d2',
          color: 'white',
          p: 2,
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Benvenuto, {user?.username}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          Ruolo: {user?.role}
        </Typography>

        <Divider sx={{ my: 2, borderColor: 'white' }} />

        <Button fullWidth sx={{ color: 'white' }}>Dashboard</Button>
        <Button fullWidth sx={{ color: 'white' }} onClick={logout}>Logout</Button>
      </Box>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Benvenuto {user?.username} ({user?.role})
        </Typography>
        {/* altri contenuti */}
      </Box>
    </Box>
  );
};

export default Dashboard;
