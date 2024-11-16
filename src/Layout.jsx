
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom'; // useLocation to get the current route
import Navbar from './components/Navbar';

const Layout = () => {
  const location = useLocation();  // Get current location/path

  // Check if the current path is either 'login' or 'register'
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {/* Only show Navbar if not on 'login' or 'register' page */}
      {!isAuthPage && <Navbar />}
      
      {/* Render the child route components */}
      <Outlet />
    </>
  );
};

export default Layout;
