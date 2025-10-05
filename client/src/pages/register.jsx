import { 
  Button, 
  Checkbox, 
  Label, 
  TextInput, 
  Spinner, 
  Select 
} from "flowbite-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import { toast } from "react-hot-toast";
<<<<<<< HEAD
import axios from "axios";
=======
import axiosInstance from "../lib/axios";
>>>>>>> 7c3a562 (Task Management)

export function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "Staff", 
  });
  const [disableButton, setDisableButton] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
<<<<<<< HEAD
      const res = await axios.post("http://localhost:5000/api/user/register",  formData,  { withCredentials: true });
=======
      const res = await axiosInstance.post("/user/register",  formData,  { withCredentials: true });
>>>>>>> 7c3a562 (Task Management)

      if (res.data.success) {
        toast.success("Registration successful!");
        navigate("/"); 
      } else {
        toast.error(res.data.message || "Registration failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center " 
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Create an Account
        </h3>

        <form className="space-y-6" onSubmit={handleRegister}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <TextInput
                id="firstName"
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <TextInput
                id="lastName"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <TextInput
              id="email"
              name="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <TextInput
              id="phone"
              name="phone"
              type="tel"
              placeholder="09XXXXXXXXX"
              value={formData.phone || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="Staff">Staff</option>
              <option value="HR">HR</option>
              <option value="Admin">Admin</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <TextInput
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <TextInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-2">
            <Checkbox id="agree" onChange={e => setDisableButton(!e.target.checked)} />
            <Label htmlFor="agree">I agree to the terms and conditions</Label>
          </div>

          <Button 
            type="submit" 
            className="bg-orange-950 hover:bg-orange-950 w-full" 
            disabled={disableButton || loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" light={true} className="mr-2" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/" className="text-green-600 hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;
