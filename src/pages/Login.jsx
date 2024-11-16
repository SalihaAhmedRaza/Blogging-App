
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase'; // Import Firebase auth instance

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    try {
      // Sign in with Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);

      // Redirect the user upon successful login
      navigate("/dashboard");  // Change to the route you want to navigate to
    } catch (error) {
      console.error(error);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-purple-700">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full sm:w-1/2 flex flex-col mobile:h-full mobile:mb-20">
        <div className="p-6 flex-1">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Welcome Back!</h2>
          <p className="text-gray-600 text-center mb-8">We’ve missed you! Log in to continue.</p>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          
          <form onSubmit={handleSubmit}>
            <div className="relative w-full mb-6">
              <fieldset className="border border-gray-300 rounded-md p-2">
                <legend className="text-gray-500 text-sm px-2">Email</legend>
                <input
                  required
                  className="bg-transparent rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </fieldset>
            </div>

            <div className="relative w-full mb-6">
              <fieldset className="border border-gray-300 rounded-md p-2">
                <legend className="text-gray-500 text-sm px-2">Password</legend>
                <input
                  required
                  className="bg-transparent rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </fieldset>
              <p 
                className="mt-2 text-right text-blue-600 cursor-pointer"
                onClick={() => setIsResetPasswordOpen(true)}
              >
                Forgot Password?
              </p>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md w-full mt-6 transition duration-300 ease-in-out"
            >
              Login
            </button>
          </form>

          <div className="flex items-center mt-8 space-x-2">
            <hr className="border-gray-400 flex-grow" />
            <span className="text-gray-500 font-bold">OR</span>
            <hr className="border-gray-400 flex-grow" />
          </div>

          <p className="text-center text-gray-600 mt-6">
            Not a member? 
            <Link to="/register" className="text-blue-600 hover:underline">
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
