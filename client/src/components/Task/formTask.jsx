import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const FormTask = () => {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [taskTitles, setTaskTitles] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [formTask, setFormTask] = useState({
    title: "",
    description: "",
    assign: "",
  });

  // Fetch employees + task titles
  const fetchData = async () => {
    try {
      const [staffRes, titlesRes] = await Promise.all([
        axios.get("http://localhost:5000/api/user/getallstaff"),
        axios.get("http://localhost:5000/api/title/getTask"),
      ]);

      setEmployees(staffRes.data.users || []);
      setTaskTitles(titlesRes.data.tasks || []);
    } catch (error) {
      console.error("Error fetching data", error);
      setEmployees([]);
      setTaskTitles([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Create Task Title
  const handleCreateTitle = async (e) => {
    e.preventDefault();
    if (!taskTitle) {
      toast.error("Please enter a task title");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/title/tasktitle",
        { task: taskTitle }
      );

      if (response.data.success) {
        toast.success("Task title created successfully");
        setTaskTitle("");
        fetchData();
      } else {
        toast.error("Failed to create task title");
      }
    } catch (error) {
      console.error("Error while creating task title", error);
      toast.error("Failed to create task title");
    }
  };

  // Assign Task
  const handleAssignTask = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formTask.title || !formTask.description || !formTask.assign) {
      toast.error("Please provide all the fields");
      setLoading(false);
      return;
    }

    try {
      const createdBy = localStorage.getItem("userId");
      const response = await axios.post(
        "http://localhost:5000/api/task/create",
        {
          ...formTask,
          createdBy,
        }
      );

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

  return (
    <div className="min-h-screen w-full px-4 sm:px-8 py-10 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Forms side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Create Task Title */}
          <motion.form
            onSubmit={handleCreateTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-5 border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Create Task Title
            </h2>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-400"
              placeholder="Enter new task title"
            />
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium shadow-md hover:bg-green-700 transition-all"
            >
              Create Title
            </motion.button>
          </motion.form>

          {/* Assign Task */}
          <motion.form
            onSubmit={handleAssignTask}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-5 border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Assign Task
            </h2>
            <p className="text-gray-500 text-center text-sm mb-4">
              Fill in the details below to assign a new task to an employee.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title
              </label>
              <select
                value={formTask.title}
                onChange={(e) =>
                  setFormTask({ ...formTask, title: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select Task Title</option>
                {taskTitles.map((t) => (
                  <option key={t._id} value={t.task}>
                    {t.task}
                  </option>
                ))}
              </select>
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
                className="w-full h-28 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
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

        {/* Employee List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
            Employee List
          </h2>
          {employees.length === 0 ? (
            <p className="text-gray-500 text-center">No employees found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr
                      key={emp._id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        {emp.firstName} {emp.lastName}
                      </td>
                      <td className="px-4 py-3">{emp.email}</td>
                      <td className="px-4 py-3 capitalize">{emp.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FormTask;
