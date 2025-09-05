import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const FormTask = () => {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [formTask, setFormTask] = useState({
    title: "",
    description: "",
    assign: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formTask.title || !formTask.description || !formTask.assign) {
      toast.error("Please provide all the fields");
      setLoading(false);
      return;
    }

    try {
      const createdBy = localStorage.getItem("userId");
      const response = await axios.post("http://localhost:5000/api/task/create", {
        ...formTask,
        createdBy,
      });

      if (response.data.success) {
        toast.success("Task assigned successfully");
        setFormTask({
          title: "",
          description: "",
          assign: "",
        });
      } else {
        toast.error("Failed to assign task");
      }
    } catch (error) {
      console.error("Error while submitting task", error);
      toast.error("Failed to assign task");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/user/getallstaff")
      .then((res) => setEmployees(res.data.users || []))
      .catch(() => setEmployees([]));
  }, []);

  return (
    <div className="min-h-screen w-full flex justify-center items-start pt-10 px-4 sm:px-6 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-gray-200 p-6 sm:p-8 rounded-2xl shadow-lg space-y-5 border border-gray-100"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">
          Assign Task
        </h2>
        <p className="text-gray-500 text-center text-sm">
          Fill in the details below to assign a new task to an employee.
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Title
          </label>
          <input
            type="text"
            value={formTask.title}
            onChange={(e) => setFormTask({ ...formTask, title: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
            placeholder="Enter task title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formTask.description}
            onChange={(e) =>
              setFormTask({ ...formTask, description: e.target.value })
            }
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
            placeholder="Enter task description"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assign To
          </label>
          <select
            value={formTask.assign}
            onChange={(e) =>
              setFormTask({ ...formTask, assign: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select employee</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.firstName} {employee.lastName}
              </option>
            ))}
          </select>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-all flex justify-center items-center"
        >
          {loading ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
              Loading...
            </>
          ) : (
            "Assign Task"
          )}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default FormTask;
