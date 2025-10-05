import React, { useState, useEffect } from "react";
import axiosInstance from "../lib/axios";
import { MdErrorOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Button, Label, TextInput, FileInput, Spinner } from "flowbite-react";
import { toast } from "react-hot-toast";
import { Camera, Eye, EyeOff } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [firstName, setFirstName] = useState(localStorage.getItem("userFirstName") || "");
  const [lastName, setLastName] = useState(localStorage.getItem("userLastName") || "");
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");
  const [phone, setPhone] = useState(localStorage.getItem("userPhone") || "");
  const [image, setImage] = useState(localStorage.getItem("userImage") || "");
  const [preview, setPreview] = useState(localStorage.getItem("userImage") || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userId) {
      alert("User not found. Please log in again.");
      navigate("/");
    }
  }, [userId, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let formData;

      if (image instanceof File) {
        formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("password", password);
        formData.append("image", image);
      } else {
        formData = { firstName, lastName, email, phone, password, image };
      }

      const config = {
        withCredentials: true,
        ...(formData instanceof FormData && {
          headers: { "Content-Type": "multipart/form-data" },
        }),
      };

      const res = await axiosInstance.put(`/user/update/${userId}`, formData, config);

      if (res.data.success) {
        const updated = res.data.user;
        toast.success("Profile updated successfully!");

        // ✅ Update local storage
        localStorage.setItem("userId", updated._id);
        localStorage.setItem("userFirstName", updated.firstName);
        localStorage.setItem("userLastName", updated.lastName);
        localStorage.setItem("userEmail", updated.email);
        localStorage.setItem("userPhone", updated.phone);
        localStorage.setItem("userImage", updated.image);

        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setMessage("Update failed.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!userId) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-lg">
        {message && (
          <p className="flex items-center gap-2 text-sm mb-4 bg-red-100 border border-red-500 rounded-lg p-2 text-red-600">
            <MdErrorOutline className="text-lg" /> {message}
          </p>
        )}

        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Update Profile
        </h1>

\        <div className="flex flex-col items-center relative mb-4">
          <img
            src={preview}
            alt="User"
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-lg"
          />
          <label className="absolute bottom-2 right-36 cursor-pointer bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
            <Camera size={18} />
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
          <p className="mt-2 text-gray-700 dark:text-gray-300 font-medium">
            {firstName} {lastName}
          </p>
        </div>

        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="firstName" value="First Name" />
            <TextInput id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="lastName" value="Last Name" />
            <TextInput id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="email" value="Email" />
            <TextInput id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="phone" value="Phone" />
            <TextInput id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="relative">
            <Label htmlFor="password" value="New Password (optional)" />
            <TextInput
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button type="submit" color="blue" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" className="mr-2" /> Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
