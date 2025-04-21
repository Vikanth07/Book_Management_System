import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Otp() {
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const email = sessionStorage.getItem("emailForOtp");

  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otpDigits];
      newOtp[index] = value;
      setOtpDigits(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otp = otpDigits.join("");
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("OTP verified successfully!",{
          position: "top-right",
          toastId: "otpVerified",
        });
        sessionStorage.removeItem("emailForOtp");

        if (sessionStorage.getItem("otpFlow") === "forgot") {
          sessionStorage.removeItem("otpFlow");
          navigate("/reset-password");
        } else {
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        }
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#f3e8ff] via-[#e5dbff] to-[#f8f0fc] px-4">
      <form
        onSubmit={handleVerify}
        className="bg-white/50 backdrop-blur-md border border-purple-200 rounded-2xl shadow-xl p-8 w-full max-w-md animate-fadeIn"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-[#845ef7] to-[#d946ef] bg-clip-text text-transparent">
          🔐 Enter OTP
        </h2>

        <div className="flex justify-between gap-2 mb-6">
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-12 text-center border border-purple-300 bg-purple-50 text-lg font-semibold rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#845ef7] to-[#d946ef] text-white py-2 rounded-xl font-medium hover:opacity-90 transition"
        >
          ✅ Verify OTP
        </button>
        <ToastContainer position="top-right" />
      </form>
    </div>
  );
}

export default Otp;
