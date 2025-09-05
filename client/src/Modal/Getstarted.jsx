import { Button, Checkbox, Label, Modal, ModalBody, ModalHeader, TextInput, Spinner } from "flowbite-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Minus  } from "lucide-react";

export function GetStarted() {
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
      const res = await axios.post("http://localhost:5000/api/user/login", { email, password }, { withCredentials: true });

      if (res.data.success) {
        toast.success("Login successful!");
        onCloseModal();

        localStorage.setItem("token", res.data.token);

        const { firstName, lastName, role, image, id } = res.data.user;

        localStorage.setItem("userId", id);
        localStorage.setItem("userFirstName", firstName);
        localStorage.setItem("userLastName", lastName);
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
      <button className="flex items-center bg-blue-600 p-2 rounded-lg  text-white hover:bg-blue-700 text-sm cursor-pointer" 
       onClick={() => setOpenModal(true)}>
         <Minus size={20} strokeWidth={1.25}/> 
           Get Started 
        <Minus  size={20} strokeWidth={1.25} />
      </button>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <ModalHeader />
        <ModalBody>
          <form className="space-y-6" onSubmit={handleLogin}>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to your Account</h3>

            <div>
              <Label htmlFor="email">Your email</Label>
              <TextInput
                id="email"
                placeholder="name@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Your password</Label>
              <TextInput
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Checkbox id="remember" onChange={e => setDisableButton(!e.target.checked)} />
                <Label htmlFor="remember">Remember me</Label>
              </div>

              <a href="#" className="text-sm text-primary-700 hover:underline dark:text-primary-500">Lost Password?</a>
            </div>

            <Button 
              type="submit" 
              className="bg-gray-950 min-w-90 hover:bg-gray-800 w-full" 
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
          </form>
        </ModalBody>
      </Modal>
    </>
  );
}

export default GetStarted;