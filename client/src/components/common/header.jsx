import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { GoDotFill } from "react-icons/go";
import { FaHome, FaUserPlus, FaClipboardList, FaTasks, FaSignOutAlt } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi"; 

const Header = ({ title }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/user/logout", {
        withCredentials: true,
      });
      localStorage.clear();
      toast.success("Logout successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed");
    }
  };

  const firstName = localStorage.getItem("userFirstName") || "";
  const lastName = localStorage.getItem("userLastName") || "";
  const image =
    localStorage.getItem("userImage") ||
    "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff";

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: <FaHome /> },
    { to: "/employee", label: "Add Employee", icon: <FaUserPlus /> },
    { to: "/view", label: "View Task List", icon: <FaClipboardList /> },
    { to: "/asignTask", label: "Assign Task", icon: <FaTasks /> },
  ];

  return (
    <header className="flex items-center justify-between bg-gray-900 px-6 py-4 shadow-md">
      <h1 className="text-xl font-bold text-white">{title}</h1>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-4">
        {navLinks.map((item, idx) => (
          <motion.div key={idx} whileHover={{ scale: 1.05 }} className="group">
            <Link
              to={item.to}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-blue-600 hover:text-white transition-all"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </motion.div>
        ))}

        <motion.div whileHover={{ scale: 1.05 }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-all"
          >
            <FaSignOutAlt />
            Sign out
          </button>
        </motion.div>
      </nav>

      {/* Profile Info (Desktop) */}
      <div className="hidden md:flex items-center gap-3">
        <Link to="/profile">
          <img
            src={image}
            alt="User"
            className="rounded-full w-10 h-10 object-cover ring-2 ring-blue-500"
          />
        </Link>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-blue-400">
            {firstName} {lastName}
          </span>
          <span className="flex items-center text-xs text-gray-400">
            <GoDotFill className="text-green-500 mr-1" /> Active
          </span>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="absolute top-16 left-0 w-full bg-gray-800 shadow-lg z-50 md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-3 px-6 py-4">
              {navLinks.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.to}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-blue-600 hover:text-white transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-all"
              >
                <FaSignOutAlt />
                Sign out
              </button>

              <div className="flex items-center gap-3 mt-3">
                <img
                  src={image}
                  alt="User"
                  className="rounded-full w-10 h-10 object-cover ring-2 ring-blue-500"
                />
                <div>
                  <p className="text-sm font-semibold text-blue-400">
                    {firstName} {lastName}
                  </p>
                  <span className="flex items-center text-xs text-gray-400">
                    <GoDotFill className="text-green-500 mr-1" /> Active
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
