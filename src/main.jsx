

import { createRoot } from 'react-dom/client';
import './index.css';
import Layout from './Layout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoutes from './components/ProtectedRoutes.jsx';
import Profile from './pages/Profile.jsx';
import User from './pages/User.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,  // This is the wrapper layout
    children: [
      { path: '', element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      {
        path: 'dashboard',
        element: <ProtectedRoutes component={<Dashboard />} />,
      },
      {
        path: 'profile',
        element: <ProtectedRoutes component={<Profile />} />,
      },
      {
        path: 'user/:id',
        element: <ProtectedRoutes component={<User />} />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);

