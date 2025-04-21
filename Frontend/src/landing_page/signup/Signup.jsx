import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Mail, Lock, User, BookOpen } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    if (password !== confirmPassword) {
      handleError("Passwords do not match.");
      return;
    }
    try {
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
        handleError(message);
        sessionStorage.removeItem("toastShown");
      }
    } catch (error) {
      console.error("Signup error:", error);
      handleError("An error occurred during signup. Please try again.");
      sessionStorage.removeItem("toastShown");
    }
  };

  return (
    <section className="min-h-screen bg-white flex items-center justify-center px-4 font-sans text-gray-800">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-8 animate-fadeIn relative">
        {/* Floating book icon */}
        <div className="absolute top-4 right-2 p-3 bg-white rounded-full border border-gray-200 shadow-sm">
          <BookOpen className="text-[#845ef7] w-6 h-6" />
        </div>

        <h1 className="text-3xl font-bold text-center mb-2">
          Join <span className="text-[#845ef7]">BookVerse</span>
        </h1>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Your Personal Book Universe, One Click Away 📚
        </p>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label htmlFor="username" className="block mb-1 font-medium">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                id="username"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#845ef7] transition"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                id="email"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#845ef7] transition"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                id="password"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#845ef7] transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-1 font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                id="confirmPassword"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#845ef7] transition"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
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
              I accept the <span className="underline">Terms and Conditions</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-[#845ef7] to-[#d946ef] hover:opacity-90 text-white font-semibold rounded-full transition duration-300 shadow-md hover:scale-105"
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
