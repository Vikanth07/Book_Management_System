import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  BookOpenText,
  PencilLine,
  Save,
  XCircle,
} from "lucide-react";

const AccountPage = () => {
  const [info, setInfo] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  const fetchInfo = async () => {
    try {
      const res = await axios.get("http://localhost:3002/api/account-info", {
        withCredentials: true,
      });
      setInfo(res.data);
      setNewUsername(res.data.username);
    } catch (err) {
      console.error("Error fetching account info", err);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "http://localhost:3002/api/account-info",
        {
          email: info.email,
          username: newUsername,
        },
        { withCredentials: true }
      );
      setEditing(false);
      fetchInfo();
    } catch (err) {
      console.error("Failed to update username", err);
    }
  };

  if (!info) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f3e8ff] via-[#e5dbff] to-[#f8f0fc]">
        <p className="text-lg text-gray-500 animate-pulse">Loading account...</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#f3e8ff] via-[#e5dbff] to-[#f8f0fc] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-white/50 backdrop-blur-md border border-purple-200 rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-[#845ef7] to-[#d946ef] bg-clip-text text-transparent flex items-center justify-center gap-2">
          <User className="w-7 h-7" />
          Account Details
        </h2>

        <div className="space-y-4 text-gray-700 text-base">
          <p className="flex items-center gap-2">
            <Mail className="text-[#845ef7] w-5 h-5" />
            <span><strong className="text-[#845ef7]">Email:</strong> {info.email}</span>
          </p>

          {editing ? (
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Username
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-purple-200 bg-purple-50 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-xl font-medium hover:opacity-90 transition"
                >
                  <Save className="w-4 h-4" />
                  Save
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-xl font-medium hover:bg-gray-400 transition"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <>
              <p className="flex items-center gap-2">
                <User className="text-[#845ef7] w-5 h-5" />
                <span>
                  <strong className="text-[#845ef7]">Username:</strong> {info.username}
                </span>
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditing(true)}
                className="mt-2 flex items-center gap-2 bg-gradient-to-r from-[#845ef7] to-[#d946ef] text-white px-4 py-2 rounded-xl font-medium hover:opacity-90 shadow-md transition"
              >
                <PencilLine className="w-4 h-4" />
                Edit Username
              </motion.button>
            </>
          )}

          <p className="flex items-center gap-2">
            <BookOpenText className="text-[#845ef7] w-5 h-5" />
            <span>
              <strong className="text-[#845ef7]">Total Books Uploaded:</strong>{" "}
              {info.totalBooks}
            </span>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default AccountPage;
