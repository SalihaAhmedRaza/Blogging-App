
import React, { useState, useEffect } from 'react';
import { auth, onAuthStateChanged } from '../config/firebase';

const Profile = () => {
  const [user, setUser] = useState(null); // State to hold the logged-in user
  const [loading, setLoading] = useState(true); // Loading state to handle auth state change
  const [isModalOpen, setIsModalOpen] = useState(false); // To toggle password change modal
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    // Listen to the user's authentication state
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Set user details if logged in
        setUser(currentUser);
      } else {
        // Reset user state if not logged in
        setUser(null);
      }
      setLoading(false); // Set loading to false after checking auth state
    });
  }, []);

  // Handle open modal for password change
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Handle close modal for password change
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Handle password update
  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    // Implement password update logic here (Firebase requires re-authentication for changing password)
    try {
      const userCredential = await auth.currentUser.reauthenticateWithCredential(
        auth.EmailAuthProvider.credential(user.email, oldPassword)
      );
      await userCredential.user.updatePassword(newPassword);
      alert('Password updated successfully');
      handleCloseModal();
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error updating password');
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading text until auth state is resolved
  }

  if (!user) {
    return <div>You need to be logged in to view your profile.</div>; // Show a message if not logged in
  }

  return (
    <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-700 min-h-screen text-white">
      <div className="container mx-auto p-6 mt-10 max-w-lg">
        <div className="bg-white shadow-lg rounded-lg p-6">
          {/* Profile Header */}
          <div className="flex justify-center relative mb-6">
            
          </div>

          {/* Profile Details */}
          <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Profile</h2>

          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <p className="text-gray-800 font-medium">Name:</p>
              <span className="text-gray-600">{user.displayName || "No name provided"}</span>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-gray-800 font-medium">Email:</p>
              <span className="text-gray-600">{user.email}</span>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-gray-800 font-medium">Company:</p>
              <span className="text-gray-600">Pritam Traders</span> {/* You can customize this if the user has a company field */}
            </div>
          </div>

          <button
            onClick={handleOpenModal}
            className="w-full mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
          >
            Change Password
          </button>

          <button
            onClick={() => auth.signOut()}
            className="w-full mt-4 bg-black text-white font-bold py-2 px-6 rounded hover:bg-gray-700"
          >
            Logout
          </button>

          {/* Password Change Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>

                <div className="mb-4">
                  <label className="block text-gray-600 text-sm mb-2" htmlFor="oldPassword">
                    Enter your old password
                  </label>
                  <input
                    type="password"
                    id="oldPassword"
                    className="border border-gray-300 p-2 rounded w-full"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-600 text-sm mb-2" htmlFor="newPassword">
                    Enter your new password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    className="border border-gray-300 p-2 rounded w-full"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-600 text-sm mb-2" htmlFor="confirmPassword">
                    Confirm your new password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="border border-gray-300 p-2 rounded w-full"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={handleUpdatePassword}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  >
                    Update Password
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

