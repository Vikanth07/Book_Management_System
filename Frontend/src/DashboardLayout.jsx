import React, { useEffect, useState } from "react";
import { Home, BookOpen, Menu, LogOut, Star, Heart, Info } from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [cookies, removeCookie] = useCookies([]);
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    if (typeof cookies.token === "undefined") return;
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/");
      } else {
        try {
          const { data } = await axios.post(
            `${API_BASE_URL}`,
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
        } catch (err) {
          console.error("Verification error:", err);
          removeCookie("token");
          navigate("/");
        }
      }
    };

    verifyCookie();
  }, [cookies.token]);

  const handleLogout = () => {
    removeCookie("token");
    navigate("/");
  };

  const navLinks = [
    {
      to: "/dashboard",
      icon: <Home className="text-purple-500 animate-bounce-slow" />,
      label: "Home",
    },
    {
      to: "/dashboard/add-book",
      icon: <BookOpen className="text-green-500 animate-wiggle" />,
      label: "Add Book",
    },
    {
      to: "/dashboard/recommendations",
      icon: <Star className="text-yellow-400 animate-spin-slow" />,
      label: "Recommendations",
    },
    {
      to: "/dashboard/liked-books",
      icon: <Heart className="text-red-400 animate-pulse-fast" />,
      label: "Liked Books",
    },
    {
      to: "/dashboard/about",
      icon: <Info className="text-blue-400 animate-pulse-slow" />,
      label: "About",
    },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#f7f1ff] to-[#fceff9] overflow-hidden">
      {/* Sidebar (Drawer on mobile) */}
      <aside
        className={`fixed z-40 inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out bg-white shadow-xl flex flex-col justify-between w-64 md:w-64`}
      >
        <div>
          <div className="p-4 flex items-center justify-between md:justify-start md:space-x-2">
            <button
              onClick={toggleSidebar}
              className="text-gray-700 hover:scale-110 transition flex items-center space-x-2"
              title="Toggle Sidebar"
            >
              <Menu className="w-6 h-6" />
              <span className="text-xl font-bold text-purple-700 hidden md:inline">
                Menu
              </span>
            </button>
          </div>

          <nav className="mt-4 space-y-2">
            {navLinks.map((item, index) => (
              <Link
                to={item.to}
                key={index}
                className="flex items-center py-2 px-4 text-gray-700 hover:bg-gradient-to-tr hover:from-[#d946ef] hover:to-[#845ef7] hover:text-white rounded-md transition-all duration-300"
                onClick={() => setSidebarOpen(false)}
              >
                <span>{item.icon}</span>
                <span className="ml-3 font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center py-2 px-3 text-red-600 hover:bg-red-100 w-full rounded-md transition-all duration-300"
          >
            <LogOut className="text-red-600 animate-bounce-slow" />
            <span className="ml-3 font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Topbar */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center md:px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="md:hidden text-gray-700 focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>

            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#845ef7] to-[#d946ef] bg-clip-text text-transparent flex items-center space-x-2">
              <BookOpen className="animate-wiggle text-purple-600" />
              <span>BookVerse Dashboard</span>
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/dashboard/account"
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#845ef7] to-[#d946ef] text-white flex items-center justify-center font-bold hover:scale-105 transition"
              title="View Profile"
            >
              {user.charAt(0).toUpperCase()}
            </Link>
            <span className="text-gray-800 font-medium hidden sm:inline">
              {user}
            </span>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="p-4 md:p-6 overflow-y-auto flex-1">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};

export default DashboardLayout;
