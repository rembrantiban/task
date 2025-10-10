import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, Edit } from "lucide-react";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";

const UpdateUserModal = ({ userId, onUpdateSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUser((prev) => ({ ...prev, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(user).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const res = await axiosInstance.put(`/user/update/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("User updated successfully ✅");
      onUpdateSuccess(res.data.user);
      handleClose();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error.response?.data?.message || "Failed to update user ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 text-white text-xs font-semibold shadow-md"
      >
        <Edit className="w-4 h-4 inline-block mr-1" />
        Edit
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-[420px] relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>

              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
                Update User Profile
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 px-3 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 px-3 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 px-3 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="text"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 px-3 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="New Password (optional)"
                  className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 px-3 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <div className="border border-dashed border-gray-400 dark:border-gray-600 rounded-xl p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition relative">
                  <label
                    htmlFor="userImage"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-full mb-2 shadow-md"
                      />
                    ) : (
                      <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                      {imagePreview ? "Change Image" : "Upload Image"}
                    </span>
                  </label>

                  <input
                    id="userImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>


                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2.5 rounded-xl text-white font-semibold transition-all shadow-md ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
                  }`}
                >
                  {loading ? "Updating..." : "Save Changes"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UpdateUserModal;
