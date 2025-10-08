import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Edit } from "lucide-react";

const UpdateUserModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    image: null,
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser({ ...user, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User updated:", user);
    setIsOpen(false);
  };

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={() => setIsOpen(true)}
        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-md hover:opacity-90 transition-all"
      >
        <Edit size={18} className="inline-block mr-2" />
        Update
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/90 backdrop-blur-xl w-[90%] max-w-2xl rounded-2xl shadow-xl p-6 relative overflow-hidden border border-white/30"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition"
              >
                <X size={22} />
              </button>

              <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
                Update User Information
              </h2>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Upload */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-blue-500/50 shadow-md">
                    <img
                      src={
                        previewImage ||
                        "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                      }
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                    <label
                      htmlFor="image"
                      className="absolute bottom-0 w-full text-center py-1 bg-black/40 text-white text-sm cursor-pointer hover:bg-black/60 transition"
                    >
                      <div className="flex justify-center items-center gap-1">
                        <Upload size={14} /> Upload
                      </div>
                    </label>
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                {/* User Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={user.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={user.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      name="role"
                      value={user.role}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">Select role</option>
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded-lg border bg-red-600 hover:bg-red-800 text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md hover:opacity-90 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UpdateUserModal;
