import React, { useEffect, useState } from "react";
import { Home, BookOpen, Menu, LogOut, Star, Heart } from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [cookies, removeCookie] = useCookies([]);
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/");
      } else {
        const { data } = await axios.post(
          "http://localhost:3002",
          {},
          { withCredentials: true }
        );
        const { status, user } = data;
        if (status) {
          setUser(user);
          if (!sessionStorage.getItem("toastShown")) {
            toast(`Hello ${user}`, {
              position: "top-right",
              toastId: "welcome",
            });
            sessionStorage.setItem("toastShown", "true");
          }
        } else {
          removeCookie("token");
          navigate("/");
        }
      }
    };

    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  const handleLogout = () => {
    removeCookie("token");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-md transition-all duration-300 flex flex-col justify-between ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div>
          <div className="p-4 flex items-center space-x-2">
            <button
              onClick={toggleSidebar}
              className="text-gray-700"
              style={{ cursor: "pointer" }}
            >
              <Menu />
            </button>
            {isSidebarOpen && (
              <span className="text-lg font-semibold text-gray-700">Menu</span>
            )}
          </div>
          <nav className="mt-4 space-y-2">
            <div className="px-4">
              <Link
                to="/dashboard"
                className="flex items-center py-2 text-gray-700 hover:bg-blue-100 transition rounded-md"
              >
                <Home className="w-5 h-5" />
                {isSidebarOpen && <span className="ml-3">Home</span>}
              </Link>
            </div>
            <div className="px-4">
              <Link
                to="/dashboard/add-book"
                className="flex items-center py-2 text-gray-700 hover:bg-blue-100 transition rounded-md"
              >
                <BookOpen className="w-5 h-5" />
                {isSidebarOpen && <span className="ml-3">Add Book</span>}
              </Link>
            </div>
            <div className="px-4">
              <Link
                to="/dashboard/recommendations"
                className="flex items-center py-2 text-gray-700 hover:bg-blue-100 transition rounded-md"
              >
                <Star className="w-5 h-5" />
                {isSidebarOpen && <span className="ml-3">Recommendations</span>}
              </Link>
            </div>
            <div className="px-4">
              <Link
                to="/dashboard/liked-books"
                className="flex items-center py-2 text-gray-700 hover:bg-blue-100 rounded-md transition"
              >
                <Heart className="w-5 h-5" />
                {isSidebarOpen && <span className="ml-3">Liked Books</span>}
              </Link>
            </div>
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4">
          <button
            className="flex items-center px-0 py-2 text-red-600 hover:bg-red-100 w-full p-2 rounded-md transition"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">
            Book Management System
          </h1>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center font-bold">
              {user.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-800 font-medium">{user.charAt(0).toUpperCase()+user.substring(1)}</span>
          </div>
        </header>

        <main className="p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DashboardLayout;
