import React from 'react';
import Navbar from './Navbar';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';

const layoutStyles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
  }
};

function Layout({ children }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <Box sx={layoutStyles.wrapper}>
      <Navbar />
      <Box sx={layoutStyles.main}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}

export default Layout; 