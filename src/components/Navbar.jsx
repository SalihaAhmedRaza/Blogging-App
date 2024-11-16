import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth'; // Import Firebase Auth functions
import { auth } from '../config/firebase'; // Assuming firebase is configured in this path

const Navbar = () => {
  const [user, setUser] = useState(null); // Initially null, will be updated on auth state change
  const navigate = useNavigate();

  // Effect to track authentication status
  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Set the currentUser to the state
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  // Handle Sign Out
  const signOutUser = async () => {
    try {
      await signOut(auth); // Call Firebase signOut method
      navigate('/login'); // Redirect to login page after sign-out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="navbar bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-2xl font-bold">
          Blogging App
        </Link>
      </div>

      {user ? (
        <div className="flex-none">
          <div className="dropdown dropdown-end text-white">
            <div tabIndex={0} role="button" className="btn btn-ghost flex items-center space-x-2">
              <span className="text-xl">{user.displayName || 'User'}</span>
              <img
                src="https://placehold.co/30"
                alt={user.displayName}
                className="w-8 h-8 rounded-full"
              />
            </div>
            <ul className="bg-white text-black menu menu-sm dropdown-content bg-base-300 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li onClick={signOutUser}>
                <Link>Logout</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex-none">
          <Link to="/login" className="btn btn-ghost text-xl">
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
