// client/src/components/Task/UpdateTask.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const UpdateTask = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [taskTitles, setTaskTitles] = useState([]);
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
    fetchTaskById();
  }, [id]);

  // Fetch task by ID
  const fetchTaskById = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/task/${id}`);
      if (res.data.success) {
        setFormTask({
          title: res.data.task.title,
          description: res.data.task.description,
          assign: res.data.task.assign,
        });
      }
    } catch (err) {
      console.error("Error fetching task:", err);
    }
  };

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formTask.title || !formTask.description || !formTask.assign) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);

    try {
      const res = await axios.put(
        `http://localhost:5000/api/task/updatetask/${id}`,
        formTask
      );
      if (res.data.success) {
        toast.success("Task updated successfully");
        navigate("/view");
      } else {
        toast.error("Failed to update task");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full px-4 sm:px-8 py-10 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-3xl mx-auto">
        <motion.form
          onSubmit={handleUpdate}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-6 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Update Task
          </h2>

          {/* Task Title */}
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

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formTask.description}
              onChange={(e) =>
                setFormTask({ ...formTask, description: e.target.value })
              }
              className="w-full h-28 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
              placeholder="Enter task description"
            ></textarea>
          </div>

          {/* Assign To */}
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
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.firstName} {emp.lastName}
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
                Updating...
              </>
            ) : (
              "Update Task"
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

export default UpdateTask;
