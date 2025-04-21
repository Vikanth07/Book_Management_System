import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:3002/reset-password",
        {
          email,
          newPassword,
        },
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
        toast.success("Password reset successful", {
          position: "bottom-left",
        });
        navigate("/login");
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#f3e8ff] via-[#e5dbff] to-[#f8f0fc] flex items-center justify-center px-4 py-8">
      <div className="flex flex-col md:flex-row items-center bg-white/50 backdrop-blur-md border border-purple-200 rounded-2xl shadow-xl overflow-hidden animate-fadeIn max-w-4xl w-full">
        
        
        {/* Right Side Form */}
        <div className="w-full p-8">
          <h2 className="text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-[#845ef7] to-[#d946ef] bg-clip-text text-transparent">
            Reset Password
          </h2>
          <p className="mb-6 text-sm text-center text-gray-700">
            Enter your email and a new password to reset your account.
          </p>

          <form onSubmit={handleResetPassword} className="space-y-5">
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

            {/* New Password Field */}
            <div>
              <label
                htmlFor="newPassword"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border border-purple-200 rounded-xl bg-purple-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                required
              />
            </div>

            {/* Reset Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#845ef7] to-[#d946ef] text-white px-4 py-2.5 rounded-xl font-semibold hover:opacity-90 shadow-md transition"
            >
              Reset Password
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-700">
            Remembered your password?{" "}
            <a
              href="/login"
              className="text-[#845ef7] hover:underline font-medium"
            >
              Login here
            </a>
          </p>
        </div>
      </div>

      <ToastContainer />
    </section>
  );
};

export default ResetPassword;
