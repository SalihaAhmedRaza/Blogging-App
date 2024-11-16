


import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
// import { auth } from '../config/firebase/firebasemethods';


const ProtectedRoutes = ({ component }) => {
  const [user, setUser] = useState(null);  // Start with null, better to distinguish loading vs logged in
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // If user is logged in, set the user state
      } else {
        setUser(null);  // If not logged in, set user to null
        navigate('/login'); // Redirect to login
      }
    });

    return () => unsubscribe();  // Cleanup subscription
  }, [navigate]);

  if (user === null) {
    return <h1>Loading...</h1>; // Show loading if we don't know if the user is logged in yet
  }

  return user ? component : null; // If user is logged in, show the component, otherwise null
};

export default ProtectedRoutes;
