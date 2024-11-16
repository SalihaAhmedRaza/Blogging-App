import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, onAuthStateChanged } from "../config/firebase";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default is false, will be updated based on auth status

  // Sample blog data (replace this with dynamic data later)
  const blogs = [
    { id: 1, title: "Introducing Whisper", author: "Elon Musk", content: "Whisper is an automatic speech recognition (ASR) system trained on 880,000 hours of multilingual data..." },
    { id: 2, title: "An Action Button Could Be Coming to the iPhone 15", author: "Inzamam Malik", content: "Apple could be putting an Action button on your next iPhone..." },
    { id: 3, title: "The Future of Artificial Intelligence", author: "Pritam Ghosh", content: "AI is changing every industry in profound ways. From healthcare to finance..." },
    { id: 4, title: "5G Networks Explained", author: "Ali Zafar", content: "5G is the next generation of mobile internet connectivity, promising faster speeds and more reliable connections..." },
    { id: 5, title: "Why Crypto Will Revolutionize the World", author: "John Doe", content: "Cryptocurrency is a decentralized digital currency that is gaining traction in financial markets..." },
    { id: 6, title: "The Impact of Remote Work on Global Economy", author: "Jane Smith", content: "With the rise of remote work, the global economy is shifting in new and unexpected ways..." },
    { id: 7, title: "Exploring Quantum Computing", author: "Albert Einstein", content: "Quantum computing is poised to revolutionize the way we solve complex problems..." },
    { id: 8, title: "Top 10 Travel Destinations in 2024", author: "Sara Lee", content: "Whether you're looking for adventure or relaxation, these destinations should be on your radar..." },
    { id: 9, title: "How AI Is Transforming Healthcare", author: "Michael Brown", content: "Artificial intelligence is making significant strides in healthcare, from diagnostics to drug discovery..." },
    { id: 10, title: "Blockchain Beyond Crypto", author: "Sophia Turner", content: "Blockchain technology is not just for cryptocurrencies. It's being used in healthcare, real estate, and more..." },
  ];

  // Check user authentication status when component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setIsLoggedIn(true);
      } else {
        // User is not signed in
        setIsLoggedIn(false);
      }
    });

    // Cleanup on component unmount
    return () => unsubscribe();
  }, []);

  // Function to handle "See All from this user" button
  const handleSeeAllBlogs = (author) => {
    if (isLoggedIn) {
      toast.info(`Showing all blogs from ${author}`); // Show all blogs from the same author (you can implement this later)
    } else {
      toast.error("You are not logged in");
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-700 min-h-screen text-white">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-4">Good Morning Readers!</h1>
        <h2 className="text-2xl font-bold mb-6">All Blogs</h2>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, index) => (
            <div key={index} className="bg-white text-black rounded-lg shadow-lg p-6 flex flex-col hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <img
                  src="https://placehold.co/50"
                  alt={blog.author}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <h3 className="text-xl font-semibold">{blog.title}</h3>
              </div>
              <p className="text-gray-700 flex-grow">{blog.content}</p>
              <button
                onClick={() => handleSeeAllBlogs(blog.author)}
                className="mt-4 text-blue-600 hover:underline"
              >
                See all from {blog.author}
              </button>
            </div>
          ))}
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Home;
