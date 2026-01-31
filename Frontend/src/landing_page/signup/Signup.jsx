import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Mail, Lock, User, BookOpen, Eye, EyeOff } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

  const handleSignup = async (e) => {
    e.preventDefault();
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasLetter || !hasNumber) {
      handleError("Password must be alphanumeric.");
      return;
    }
    if (password.length < 8) {
      handleError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      handleError("Passwords do not match.");
      return;
    }
    try {
      if (!API_BASE_URL) {
        console.error("API_BASE_URL is not defined. Please set VITE_API_BASE_URL in your .env file");
        handleError("API configuration error. Please check your environment variables. VITE_API_BASE_URL is not set.");
        return;
      }
      console.log("Attempting signup with API_BASE_URL:", API_BASE_URL);
      const { data } = await axios.post(
        `${API_BASE_URL}/signup`,
        { username, email, password },
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        sessionStorage.removeItem("toastShown");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        handleError(message || "Signup failed. Please try again.");
        sessionStorage.removeItem("toastShown");
      }
    } catch (error) {
      console.error("Signup error:", error);
      let errorMessage = "Something went wrong. Please try again.";
      
      // Handle network errors specifically
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        errorMessage = "Network error: Unable to connect to server. Please check if the backend server is running.";
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = "Connection refused: Backend server is not running or not accessible.";
      } else if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please check your network connection and ensure the backend is running.";
      } else {
        // Something else happened
        errorMessage = error.message || "An unexpected error occurred.";
      }
      
      handleError(errorMessage);
      sessionStorage.removeItem("toastShown");
    }
  };

  return (
    <section className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 font-sans text-gray-800">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl px-6 py-10 sm:px-8 animate-fadeIn relative">
        {/* Floating book icon */}
        <div className="absolute top-4 right-2 p-2 sm:p-3 bg-white rounded-full border border-gray-200 shadow-sm">
          <BookOpen className="text-[#845ef7] w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-3">
          Join <span className="text-[#845ef7]">BookVerse</span>
        </h1>
        <p className="text-center text-gray-500 mb-6 text-sm sm:text-base">
          Your Personal Book Universe, One Click Away 📚
        </p>

        <form onSubmit={handleSignup} className="space-y-5 sm:space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block mb-1 font-medium text-sm"
            >
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <input
                type="text"
                id="username"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#845ef7] transition text-sm sm:text-base"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-sm">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <input
                type="email"
                id="email"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#845ef7] transition text-sm sm:text-base"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1 font-medium text-sm"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#845ef7] transition text-sm sm:text-base"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-1 font-medium text-sm"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#845ef7] transition text-sm sm:text-base"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          <div className="flex items-center text-sm mt-1 text-gray-500">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 border-gray-300 rounded mr-2"
              required
            />
            <label htmlFor="terms">
              I accept the{" "}
              <span className="underline">Terms and Conditions</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-[#845ef7] to-[#d946ef] hover:opacity-90 text-white font-semibold rounded-full transition duration-300 shadow-md hover:scale-[1.02] text-sm sm:text-base"
          >
            Create Account
          </button>

          <p className="text-center text-sm mt-3 text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="underline font-semibold text-[#845ef7] hover:text-[#d946ef]"
            >
              Login here
            </Link>
          </p>
        </form>
        <ToastContainer />
      </div>
    </section>
  );
}

export default Signup;
