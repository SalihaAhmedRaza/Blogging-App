
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { auth } from '../config/firebase';

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setError("");

        try {
            // Register the user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update the user's profile with their name (optional)
            await updateProfile(user, {
                displayName: `${firstName} ${lastName}`,
            });

            // Optionally, store other user information in your database
            const formData = {
                firstName,
                lastName,
                email,
                companyName: businessName, // Rename to match your backend schema
                password,
                updateDate: new Date(), // Add a default value for updateDate if needed
                Status: 1, // Add a default status if it’s required
            };

            // You can now send `formData` to your backend for further processing, 
            // such as saving additional user details in a database

            // Redirect the user to the login page or another page upon successful registration
            navigate("/login");
        } catch (error) {
            console.error("Error registering user:", error);
            setError("Error registering user. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-purple-700 p-6">
            <div className="bg-white shadow-md rounded-lg w-full sm:w-4/5 md:w-1/2 lg:w-1/3 p-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Create Your Account</h2>
                <p className="text-gray-600 text-center mb-8">Welcome! Please fill in the details below.</p>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1" htmlFor="firstName">First Name</label>
                            <input
                                required
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                id="firstName"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-1" htmlFor="lastName">Last Name</label>
                            <input
                                required
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                id="lastName"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm text-gray-600 mb-1" htmlFor="email">Email</label>
                        <input
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                   

                    <div className="mb-4">
                        <label className="block text-sm text-gray-600 mb-1" htmlFor="password">Password</label>
                        <input
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm text-gray-600 mb-1" htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition duration-200"
                    >
                        Register
                    </button>

                    <div className="flex items-center my-4">
                        <hr className="flex-grow border-t border-gray-500" />
                        <span className="mx-4 text-gray-700">or, Continue with</span>
                        <hr className="flex-grow border-t border-gray-500" />
                    </div>

                    <div className="text-center">
                        <p className="text-gray-600">Already have an account?</p>
                        <Link to="/login" className="text-blue-500 hover:text-blue-700 ml-1">Sign In</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
