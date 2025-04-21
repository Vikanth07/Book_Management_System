import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import startimg from "../assets/page2.jpg"; 

const StartPage = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#a78bfa] to-[#f3a8f9] px-6 overflow-hidden">
      {/* Navigation */}
      <nav className="bg-white p-4 shadow-lg text-wpurple rounded-b-xl z-10">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-semibold text-purple-700 flex items-center gap-2 tracking-wide">
            <BookOpen className="w-6 h-6 text-purple-500 animate-pulse" />
            <span>BookVerse</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 text-lg bg-purple-600 text-white rounded-full font-semibold shadow hover:bg-purple-700 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-5 py-2 text-lg bg-pink-500 text-white rounded-full font-semibold shadow hover:bg-pink-600 transition"
            >
              Signup
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto mt-16 md:mt-28 p-10 md:p-16 rounded-3xl shadow-2xl flex flex-col-reverse md:flex-row items-center justify-between gap-12 border border-white/40 bg-white">
        {/* Left Text Block */}
        <motion.div
          className="md:w-1/2 text-center md:text-left"
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 60, delay: 0.2 }}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#845ef7] to-[#d946ef] bg-clip-text text-transparent mb-6 tracking-tight drop-shadow-md"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 10,
              repeat: Infinity,
              repeatType: "mirror",
              duration: 3,
            }}
          >
            Welcome to BookVerse
          </motion.h1>

          <p className="text-gray-800 text-lg md:text-xl mb-4 font-medium leading-relaxed font-serif">
            Your personal library, <span className="text-purple-600 font-semibold">organized beautifully</span>.
          </p>

          <p className="text-gray-700 text-base md:text-lg mb-6 leading-relaxed font-serif">
            Manage your reads, track your progress, and share your literary journey with ease. Whether it's a cherished classic or a future favorite — it's all here, just for you.
          </p>

          <p className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm md:text-base italic py-2 px-5 rounded-full shadow-lg inline-block font-semibold tracking-wide animate-fadeIn">
            ✨ Read. Share. Keep your stories safe with BookVerse.
          </p>
        </motion.div>

        {/* Right Image Block */}
        <motion.div
          className="md:w-1/2"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 60, delay: 0.4 }}
        >
          <img
            src={startimg}
            alt="Books"
            className="rounded-2xl shadow-xl w-full h-auto"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default StartPage;
