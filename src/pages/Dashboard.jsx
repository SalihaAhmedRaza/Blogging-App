

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the necessary CSS for toasts
import { auth, db } from "../config/firebase"; // Import Firebase Auth and Firestore
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"; // Firestore functions

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false); // Modal for adding new blog
  const [showEditModal, setShowEditModal] = useState(false); // Modal for editing existing blog
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal for delete confirmation
  const [title, setTitle] = useState(""); // Blog title
  const [content, setContent] = useState(""); // Blog content
  const [author, setAuthor] = useState(""); // Blog author
  const [blogs, setBlogs] = useState([]); // All blogs
  const [user, setUser] = useState(null); // Authenticated user
  const [blogToDelete, setBlogToDelete] = useState(null); // Blog ID for delete
  const [blogToEdit, setBlogToEdit] = useState(null); // Blog ID for editing

  // Effect to check authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        toast.error("Please log in to post a blog.");
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch blogs from Firestore when component mounts
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "blogs"));
        const blogsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogsList); // Set the blogs to the state
      } catch (error) {
        console.error("Error fetching blogs:", error.message);
        toast.error("Error fetching blogs.");
      }
    };

    fetchBlogs();
  }, []);

  // Add new blog to Firestore
  const addBlogToFirestore = async (blogData) => {
    try {
      if (!user) {
        toast.error("User not authenticated.");
        return;
      }

      const docRef = await addDoc(collection(db, "blogs"), {
        ...blogData,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      });

      toast.success("Blog successfully uploaded!");
      return docRef.id;
    } catch (error) {
      console.error("Error adding blog to Firestore:", error.message);
      toast.error("Error uploading blog.");
    }
  };

  // Handle form submission for new blog
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !author) {
      toast.error("All fields are required!");
      return;
    }

    const blogData = { title, content, author };

    try {
      const blogId = await addBlogToFirestore(blogData);
      if (blogId) {
        setBlogs((prevBlogs) => [
          ...prevBlogs,
          { ...blogData, id: blogId },
        ]);
        setShowModal(false); // Close the modal
        setTitle("");
        setContent("");
        setAuthor("");
      }
    } catch (error) {
      toast.error("Error uploading blog.");
    }
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    if (!blogToDelete) return;

    try {
      await deleteDoc(doc(db, "blogs", blogToDelete)); // Delete blog
      toast.success("Blog successfully deleted!");
      setBlogs(blogs.filter((blog) => blog.id !== blogToDelete)); // Remove blog from state
      setShowDeleteModal(false); // Close delete modal
    } catch (error) {
      console.error("Error deleting blog:", error.message);
      toast.error("Error deleting blog.");
    }
  };

  // Handle edit of a blog
  const handleEdit = async () => {
    if (!title || !content || !author) {
      toast.error("All fields are required!");
      return;
    }

    const updatedBlogData = { title, content, author };

    try {
      const blogDoc = doc(db, "blogs", blogToEdit);
      await updateDoc(blogDoc, updatedBlogData); // Update blog in Firestore
      toast.success("Blog successfully updated!");
      setBlogs(blogs.map((blog) => (blog.id === blogToEdit ? { ...blog, ...updatedBlogData } : blog))); // Update state
      setShowEditModal(false); // Close edit modal
      setTitle("");
      setContent("");
      setAuthor("");
    } catch (error) {
      console.error("Error updating blog:", error.message);
      toast.error("Error updating blog.");
    }
  };

  // Open edit modal and set current blog data to the form
  const openEditModal = (blog) => {
    setBlogToEdit(blog.id);
    setTitle(blog.title);
    setContent(blog.content);
    setAuthor(blog.author);
    setShowEditModal(true);
  };

  return (
    <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-700 min-h-screen text-white">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-6">Good Morning Readers!</h1>
        <h2 className="text-2xl font-semibold mb-6">All Blogs</h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg shadow-md hover:from-purple-700 hover:to-pink-700 mb-4"
        >
          Add New Blog
        </button>

        {/* Add New Blog Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md w-96 text-black shadow-lg">
              <h2 className="text-xl font-bold mb-4">Add a New Blog</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Author</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    rows="4"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg shadow-md hover:from-purple-700 hover:to-pink-700 w-full"
                >
                  Post Blog
                </button>
              </form>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 text-red-500 hover:text-red-700"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Edit Blog Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md w-96 text-black shadow-lg">
              <h2 className="text-xl font-bold mb-4">Edit Blog</h2>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Author</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    rows="4"
                    required
                  />
                </div>
                <button
                  onClick={handleEdit}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg shadow-md hover:from-purple-700 hover:to-pink-700 w-full"
                >
                  Update Blog
                </button>
              </form>
              <button
                onClick={() => setShowEditModal(false)}
                className="mt-4 text-red-500 hover:text-red-700"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Delete Blog Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md w-96 text-black shadow-lg">
              <h2 className="text-xl font-bold mb-4">Are you sure you want to delete this blog?</h2>
              <div className="flex justify-between">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Blogs Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {blogs.map((blog, index) => (
            <div key={index} className="bg-white text-black p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center mb-3">
                <img
                  src="https://placehold.co/50"
                  alt={blog.author}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <h3 className="text-xl font-semibold">{blog.title}</h3>
              </div>
              <p className="text-gray-700">{blog.content}</p>
              <p className="text-gray-500 text-sm mt-2">By {blog.author}</p>
              <div className="mt-4">
                <button
                  onClick={() => openEditModal(blog)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg shadow-md hover:from-purple-700 hover:to-pink-700 mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setBlogToDelete(blog.id);
                    setShowDeleteModal(true);
                  }}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default Dashboard;

