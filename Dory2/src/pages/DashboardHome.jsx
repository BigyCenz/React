import React from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const DashboardHome = () => {

  const { user, logout } = useAuth();

  return (<>DASHBOARD</>);

};

export default DashboardHome;
