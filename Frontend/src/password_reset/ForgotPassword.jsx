import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Lock } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import bookBoxImage from '../assets/forgotpassword.png';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/forgot-password`,
        { email },
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
        sessionStorage.removeItem("toastShown");
        sessionStorage.setItem("emailForOtp", email);
        sessionStorage.setItem("otpFlow", "forgot");
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
    <section className="min-h-screen bg-gradient-to-br from-[#f3e8ff] via-[#e5dbff] to-[#f8f0fc] flex items-center justify-center px-4">
      <div className="relative w-full max-w-md bg-white/50 backdrop-blur-md border border-purple-200 rounded-2xl shadow-xl p-8 animate-fadeIn">

        {/* Lock Icon Top Right */}
        <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-sm">
          <Lock className="text-[#845ef7] w-6 h-6" />
        </div>

        <h2 className="text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-[#845ef7] to-[#d946ef] bg-clip-text text-transparent">
          Forgot Password
        </h2>
        <p className="mb-6 text-sm text-center text-gray-700">
          Enter your email to receive an OTP and reset your password.
        </p>

        <form onSubmit={handleForgotPassword} className="space-y-5">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-purple-200 rounded-xl bg-purple-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#845ef7] to-[#d946ef] text-white px-4 py-2.5 rounded-xl font-semibold hover:opacity-90 shadow-md transition"
          >
            Send OTP
          </button>
        </form>
        <img
                  src={bookBoxImage}
                  alt="Books in a box"
                  className="absolute -top-40 -left-25 w-60 h-60 object-contain pointer-events-none"
                />

        <p className="mt-4 text-sm text-center text-gray-700">
          Remembered your password?{" "}
          <a
            href="/"
            className="text-[#845ef7] hover:underline font-medium"
          >
            Login here
          </a>
        </p>
      </div>
      <ToastContainer />
    </section>
  );
};

export default ForgotPassword;
