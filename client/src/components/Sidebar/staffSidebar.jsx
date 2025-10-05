import React, { useState, useEffect } from "react";
import { MdMenu } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import axiosInstance from "../../lib/axios";
import { toast } from "react-hot-toast";

function StaffHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/user/logout", {
        withCredentials: true,
      });
      localStorage.removeItem("userId");
      localStorage.removeItem("userFirstName");
      localStorage.removeItem("userLastName");
      localStorage.removeItem("userImage");
      toast.success("Logout successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    axiosInstance
      .get(`/user/profile/${userId}`)
      .then((res) => {
        if (res.data.success) {
          setFirstName(res.data.profile.firstName);
          setLastName(res.data.profile.lastName);
          setImage(res.data.profile.image);
        }
      })
      .catch(() => {
        setFirstName("");
        setLastName("");
        setImage("");
      });
  }, []);

  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left side (Logo + Menu) */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none sm:hidden"
          >
            <MdMenu className="w-7 h-7" />
          </button>
          <Link to="/staffdashboard">
            <h1 className="text-xl font-bold text-blue-700">SVCG Voting</h1>
          </Link>
        </div>

        {/* Center navigation (hidden on small screens) */}
        <nav className="hidden sm:flex gap-6 font-medium text-gray-700">
          <Link
            to="/staffdashboard"
            className="hover:text-blue-600 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/toDoTask"
            className="hover:text-blue-600 transition-colors"
          >
            To Do
          </Link>
        </nav>

        {/* Right side (Profile + Logout) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <img
              src={image || "/default-avatar.png"}
              alt="User"
              className="w-10 h-10 rounded-full object-cover border"
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-semibold text-gray-800">
                {firstName} {lastName}
              </span>
              <span className="flex items-center text-xs text-green-600 font-medium">
                <GoDotFill className="mr-1 text-green-500" /> Active
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.nav
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="sm:hidden bg-white shadow-md flex flex-col px-6 py-3 space-y-3"
        >
          <Link
            to="/staffdashboard"
            className="text-gray-700 hover:text-blue-600 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/toDoTask"
            className="text-gray-700 hover:text-blue-600 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            To Do
          </Link>
        </motion.nav>
      )}
    </header>
  );
}

export default StaffHeader;
