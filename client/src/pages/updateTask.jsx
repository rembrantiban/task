import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const UpdateTask = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [formTask, setFormTask] = useState({
    title: "",
    description: "",
    assign: "",
  });

  useEffect(() => {
    if (location.state) {
      setFormTask({
        title: location.state.title || "",
        description: location.state.description || "",
        assign: location.state.assign || "",
      });
    }
  }, [location.state]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/getallstaff");
        setEmployees(res.data.users || []);
      } catch {
        setEmployees([]);
      }
    };
    fetchEmployees();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formTask.title || !formTask.description || !formTask.assign) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.put(`http://localhost:5000/api/task/updatetask/${id}`, formTask);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 space-y-6 transition-all duration-300">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-4">
          Update Task
        </h2>

        <form className="space-y-5" onSubmit={handleUpdate}>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={formTask.title}
              onChange={(e) => setFormTask({ ...formTask, title: e.target.value })}
              placeholder="Enter task title"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200 transition"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formTask.description}
              onChange={(e) => setFormTask({ ...formTask, description: e.target.value })}
              placeholder="Enter task description"
              rows={4}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200 transition"
              required
            ></textarea>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assign To
            </label>
            <select
              value={formTask.assign}
              onChange={(e) => setFormTask({ ...formTask, assign: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200 transition"
              required
            >
              <option value="">Select employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Updating...
              </>
            ) : (
              "Update Task"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateTask;
