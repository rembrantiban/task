import React, { useState } from "react";
import { CircleX, CircleCheck, Upload } from "lucide-react";

import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";

const CreateModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    image: null,
    role: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const res = await axiosInstance.post(
        "/user/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setTimeout(() => window.location.reload(), 1500);
        setIsOpen(false);
        setData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          phone: "",
          image: null,
          role: "",
        });
        toast.success("User registered successfully!");
      } else {
        toast.error(res.data.message || "Registration failed");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all"
      >
        + Add Employee
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Employee
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <CircleX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Profile Image
                </label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">
                    Click to upload or drag & drop
                  </span>
                  <input
                    id="image"
                    type="file"
                    name="image"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={data.firstName}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={data.lastName}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={data.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={data.password}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  value={data.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Select a Role
                </label>
                <select
                  name="role"
                  value={data.role}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="">Choose a Role</option>
                  <option value="Admin">Admin</option>
                  <option value="HR">HR</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 w-full sm:w-1/2 px-5 py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70 transition-all"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <CircleCheck size={18} />
                      Save
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full sm:w-1/2 px-5 py-2.5 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-all"
                >
                  <CircleX size={18} />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateModal;
