import { 
  Button, 
  Checkbox, 
  Label, 
  Modal, 
  ModalBody, 
  ModalHeader, 
  TextInput, 
  Spinner 
} from "flowbite-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";
import { User } from "lucide-react";

export function Login() {
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disableButton, setDisableButton] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function onCloseModal() {
    setOpenModal(false);
    setEmail("");
    setPassword("");
    setDisableButton(true);
    setLoading(false);
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {

      const res = await axiosInstance.post(
        "/user/login", 
        { email, password }, 
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Login successful!");
        onCloseModal();

        localStorage.setItem("token", res.data.token);


        const { _id, firstName, lastName, role, email, phone, password, image } = res.data.user;


        localStorage.setItem("userId", _id);
        localStorage.setItem("userFirstName", firstName);
        localStorage.setItem("userLastName", lastName);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userPhone", phone);

        localStorage.setItem("userPassword", password);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userImage", image);


        if (role === "Admin" || role === "HR") navigate("/dashboard");
        else if (role === "Staff") navigate("/staffdashboard");
        else navigate("/");
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        className="flex items-center bg-orange-950 hover:bg-orange-900 
          px-5 py-2.5 rounded-lg text-white hover:opacity-90 text-sm font-medium shadow-md transition" 
        onClick={() => setOpenModal(true)}
      >
        <User className="mr-2" size={20} /> 
        Sign in
      </button>

      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <ModalHeader />
        <ModalBody>
          <div className="flex flex-col items-center text-center space-y-3">
            <img 
              src="/logo.png" 
              alt="App Logo" 
              className="w-20 h-20 drop-shadow-md" 
            />

            <h3 className="text-2xl font-bold text-gray-900">
              Welcome Back
            </h3>
            <p className="text-sm text-gray-500">
              Please sign in to your account
            </p>
          </div>

          <form className="space-y-6 mt-6" onSubmit={handleLogin}>
            <div>
              <Label htmlFor="email" className="mb-1 text-gray-700">Email</Label>
              <TextInput
                id="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="password" className="mb-1 text-gray-700">Password</Label>
              <TextInput
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex gap-2">
                <Checkbox id="remember" onChange={(e) => setDisableButton(!e.target.checked)} />
                <Label htmlFor="remember">Remember me</Label>
              </div>
             
            </div>

            <Button 
              type="submit" 
              className="bg-orange-950 hover:bg-orange-900  hover:opacity-90 w-full shadow-md rounded-lg transition" 
              disabled={disableButton || loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" light={true} className="mr-2" />
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </Button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Register
              </Link>
            </p>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
}

export default Login;
