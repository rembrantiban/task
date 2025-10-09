import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Loader2, ClipboardEdit, User, ArrowLeft, Save } from "lucide-react";

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

  const fetchData = async () => {
    try {
      const [staffRes, titlesRes] = await Promise.all([
        axiosInstance.get("/user/getallstaff"),
        axiosInstance.get("/title/getTask"),
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

  const fetchTaskById = async () => {
    try {
      const res = await axiosInstance.get(`/task/${id}`);
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formTask.title || !formTask.description || !formTask.assign) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.put(`/task/updatetask/${id}`, formTask);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center gap-2">
          <ClipboardEdit className="w-6 h-6 text-blue-600" />
          Update Task
        </h2>

        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Task Title */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Task Title
            </label>
            <select
              value={formTask.title}
              onChange={(e) =>
                setFormTask({ ...formTask, title: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formTask.description}
              onChange={(e) =>
                setFormTask({ ...formTask, description: e.target.value })
              }
              placeholder="Enter task description..."
              className="w-full h-28 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none transition"
            />
          </div>

          {/* Assign */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Assign To
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 focus-within:ring-2 focus-within:ring-indigo-500 transition">
              <User className="w-5 h-5 text-gray-400 mr-2" />
              <select
                value={formTask.assign}
                onChange={(e) =>
                  setFormTask({ ...formTask, assign: e.target.value })
                }
                className="w-full py-3 bg-transparent outline-none"
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>
            <div className="grid grid-cols-2 gap-4">
            <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(-1)}
            className="w-full py-3  gap-2 bg-red-600 text-white rounded-xl font-semibold shadow-md hover:bg-red-700 transition flex justify-center items-center"
          >
            <ArrowLeft size={20}/>
          
            Back
          </motion.button>
        
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 gap-2 bg-indigo-600 text-white rounded-xl font-semibold shadow-md hover:bg-indigo-700 transition flex justify-center items-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
              <Save size={20} />
              Update Task
              </>
            )}
          </motion.button>
            </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UpdateTask;
