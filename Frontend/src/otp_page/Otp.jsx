import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Otp() {
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const email = sessionStorage.getItem("emailForOtp");

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otpDigits];
      newOtp[index] = value;
      setOtpDigits(newOtp);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otp = otpDigits.join("");
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsVerifying(true);
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("OTP verified successfully!", {
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
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-gradient-to-br from-[#f3e8ff] via-[#e5dbff] to-[#f8f0fc]">
      <form
        onSubmit={handleVerify}
        className="w-full max-w-md bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-purple-200 animate-fadeIn"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-[#845ef7] to-[#d946ef] bg-clip-text text-transparent">
          🔐 Enter OTP
        </h2>

        {/* OTP Input Row - Fixed width container for alignment */}
        <div className="flex justify-center mb-6">
          <div className="flex gap-3 sm:gap-4 justify-center w-[320px] sm:w-[360px]">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength="1"
                aria-label={`OTP digit ${index + 1}`}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-12 sm:w-14 sm:h-14 text-center border border-purple-300 bg-purple-50 text-lg font-semibold rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isVerifying}
          className={`w-full py-2 rounded-xl font-medium transition ${
            isVerifying
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-[#845ef7] to-[#d946ef] text-white hover:opacity-90"
          }`}
        >
          {isVerifying ? "Verifying..." : "✅ Verify OTP"}
        </button>
      </form>
      <ToastContainer position="top-right" />
    </div>
  );
}

export default Otp;
