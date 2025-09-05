import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdErrorOutline } from "react-icons/md";

import { useNavigate } from "react-router-dom";
import { Button, Label, TextInput, FileInput, Spinner } from "flowbite-react";
import { toast } from "react-hot-toast";

const Profile = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState(localStorage.getItem("userFirstName") || "");
  const [lastName, setLastName] = useState(localStorage.getItem("userLastName") || "");
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");
  const [phone, setPhone] = useState(localStorage.getItem("userPhone") || "");
  const [image, setImage] = useState(localStorage.getItem("userImage") || "");
  const [preview, setPreview] = useState(localStorage.getItem("userImage") || "");
  const [password, setPassword] = useState(localStorage.getItem("userpassword") || "");
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
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    let formData;
    if (image instanceof File && 
        email === localStorage.getItem("userEmail") &&
        firstName === localStorage.getItem("userFirstName") &&
        lastName === localStorage.getItem("userLastName") &&
        phone === localStorage.getItem("userPhone") &&
        password === "") {
      formData = new FormData();
      formData.append("image", image);
    } else if (image instanceof File) {
      formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("image", image);
    } else {
      formData = {
        firstName,
        lastName,
        email,
        phone,
        password,
        image,
      };
    }

    const config = {
      withCredentials: true,
      ...(formData instanceof FormData && {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    };

    const res = await axios.put(
      `http://localhost:5000/api/user/update/${userId}`,
      formData,
      config
    );

    if (res.data.success) {
      const updated = res.data.user;
      toast.success("Profile updated successfully!");
      localStorage.setItem("userFirstName", updated.firstName);
      localStorage.setItem("userLastName", updated.lastName);
      localStorage.setItem("userEmail", updated.email);
      localStorage.setItem("userPhone", updated.phone);
      localStorage.setItem("userImage", updated.image);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } else {
      setMessage("Update failed.");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error.response && error.response.data && error.response.data.message) {
      setMessage(error.response.data.message);
    } else {
      setMessage("Something went wrong while updating.");
    }
  } finally {
    setLoading(false);
  }
};
  if (!userId) return null;

  return (
    <div className="flex justify-center items-center min-h-screen  dark:bg-gray-900">
      <div className="dark:bg-gray-200 p-6 rounded-lg shadow-xl w-full max-w-md">
         {message && <p className="text-center text-md text-md bg-red-100 transition-all   mb-4 border-2 border-red-500 rounded-2xl p-2 text-red-500">
          <MdErrorOutline className="inline-block mr-2 text-2xl" /> {message}</p>}    

        <h1 className="text-2xl font-semibold text-center  dark:text-black mb-4">Update Profile</h1>

        <div className="flex flex-col items-center">
          <img
            src={preview}
            alt="User"
            className="w-24 h-24 rounded-full object-cover mb-4 border border-gray-500"
          />
          <p className=" dark:text-black">{firstName} {lastName}</p>
        </div>

        <form className="mt-4 flex flex-col gap-4" onSubmit={handleUpdate}>
          <div>
            <Label htmlFor="firstName" value="First Name" /> 
            <TextInput id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)}  placeholder="FisrtName"
              />
          </div>
          <div>
            <Label htmlFor="lastName" value="Last Name" />
            <TextInput id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)}    placeholder="Lastame"/>
          </div>

          <div>
            <Label htmlFor="email" value="Email" />
            <TextInput id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}  placeholder="example@gmail.com" />
          </div>

          <div>
            <Label htmlFor="phone" value="Phone" />
            <TextInput id="phone" value={phone} onChange={(e) => setPhone(e.target.value)}  placeholder="Phone"/>
          </div>

          <div>
            <Label htmlFor="image" value="Profile Image" />
            <FileInput id="image" accept="image/*" onChange={handleImageChange} />
          </div>

          <div>
            <Label htmlFor="password" value="New Password (optional)" />
            <TextInput id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
          </div>

          <Button type="submit" color="blue">
            {loading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Updating...
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
