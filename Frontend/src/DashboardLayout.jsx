import React, { useEffect, useState } from "react";
import { Home, BookOpen, Menu, LogOut, Star, Heart } from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  // Navigation links with unique animated icons
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
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#f7f1ff] to-[#fceff9]">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-xl transition-all duration-500 ease-in-out flex flex-col justify-between ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div>
          <div className="p-4 flex items-center space-x-2">
            <div className="p-4 flex items-center space-x-2">
              <button
                onClick={toggleSidebar}
                className="text-gray-700 hover:scale-110 transition flex items-center space-x-3"
                title="Toggle Sidebar"
              >
                {isSidebarOpen ? (
                  <Menu className="animate-bounce-slow text-gray-700 w-8 h-8 transition-all duration-300" />
                ) : (
                  <div className="w-6 h-8 relative transition-all duration-300">
                    <span className="absolute left-1/2 top-0 transform -translate-x-1/2 w-1.5 h-full bg-purple-600 rounded transition-all duration-300 rotate-90"></span>
                  </div>
                )}
                {isSidebarOpen && (
                  <span className="text-xl font-bold text-purple-700">
                    Menu
                  </span>
                )}
              </button>
            </div>
          </div>

          <nav className="mt-6 space-y-3">
            {navLinks.map((item, index) => (
              <div className="px-4" key={index}>
                <Link
                  to={item.to}
                  className="flex items-center py-2 px-3 text-gray-700 hover:bg-gradient-to-tr hover:from-[#d946ef] hover:to-[#845ef7] hover:text-white rounded-md transition-all duration-300 group"
                >
                  <span>{item.icon}</span>
                  {isSidebarOpen && (
                    <span className="ml-3 font-medium">{item.label}</span>
                  )}
                </Link>
              </div>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center py-2 px-3 text-red-600 hover:bg-red-100 w-full rounded-md transition-all duration-300 group"
          >
            <LogOut className="text-red-600 animate-bounce-slow" />

            {isSidebarOpen && (
              <span className="ml-3 font-semibold">Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#845ef7] to-[#d946ef] bg-clip-text text-transparent flex items-center space-x-2">
            <BookOpen className="animate-wiggle text-purple-600" />
            <span>BookVerse Dashboard</span>
          </h1>

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

        <main className="p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DashboardLayout;
