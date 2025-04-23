import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Mail, Lock, BookOpen, Eye, EyeOff } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
      const { success, message } = data;

      if (success) {
        sessionStorage.removeItem("toastShown");
        sessionStorage.setItem("emailForOtp", email);
        navigate("/otp");
      } else {
        handleError(message);
        sessionStorage.removeItem("toastShown");
      }
    } catch (err) {
      handleError(err.response?.data?.message || "Something went wrong");
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

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">
          Welcome to <span className="text-[#845ef7]">BookVerse</span>
        </h1>
        <p className="text-center text-gray-500 mb-5 sm:mb-6 text-sm sm:text-base">
          Your Personal Book Universe, One Click Away 📚
        </p>

        <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block mb-1 font-medium text-gray-700 text-sm"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 sm:top-3 text-gray-400 w-4 h-4" />
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
              className="block mb-1 font-medium text-gray-700 text-sm"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 sm:top-3 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#845ef7] transition text-sm sm:text-base"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                className="absolute right-3 top-2.5 sm:top-3 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end text-sm">
            <Link
              to="/forgot-password"
              className="text-[#845ef7] hover:text-[#d946ef] font-medium"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-[#845ef7] to-[#d946ef] hover:opacity-90 text-white font-semibold rounded-full transition duration-300 shadow-md hover:scale-[1.02] text-sm sm:text-base"
          >
            Sign In
          </button>

          <p className="text-center text-sm mt-3 text-gray-500">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="underline font-semibold text-[#845ef7] hover:text-[#d946ef]"
            >
              Sign up
            </Link>
          </p>
        </form>

        <ToastContainer />
      </div>
    </section>
  );
}

export default Login;
