import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ToDoTable = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:5000/api/task/getuserassign/${userId}`)
      .then((res) => setTasks(res.data.tasks || []))
      .catch(() => setTasks([]));
  }, [userId]);

  const getNextStatus = (status) => {
    if (status === "Pending") return "In Progress";
    if (status === "In Progress") return "Completed";
    return null;
  };

  const handleStatusClick = async (task) => {
    const nextStatus = getNextStatus(task.status);
    if (!nextStatus) return;
    try {
      await axios.put(`http://localhost:5000/api/task/updatestatus`, {
        taskId: task._id,
        status: nextStatus,
      });
      setTasks((tasks) =>
        tasks.map((t) =>
          t._id === task._id ? { ...t, status: nextStatus } : t
        )
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "Pending")
      return "bg-amber-100 text-amber-700 border border-amber-300";
    if (status === "In Progress")
      return "bg-blue-100 text-blue-700 border border-blue-300";
    if (status === "Completed")
      return "bg-green-100 text-green-700 border border-green-300";
    return "bg-gray-100 text-gray-700 border border-gray-300";
  };

  return (
    <div className="p-6">
      <div className="overflow-hidden rounded-2xl shadow-xl bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-blue-900 to-blue-950 text-white text-sm uppercase tracking-wide">
            <tr>
              <th className="px-6 py-3">Employee</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Assigned By</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tasks.map((task) => (
              <motion.tr
                key={task._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-50 transition-all duration-200"
              >
                {/* Employee */}
                <td className="px-6 py-4 flex items-center gap-3">
                  <img
                    src={task.assign?.image}
                    alt="User"
                    className="w-12 h-12 rounded-full border-2 border-indigo-500 shadow-sm object-cover"
                  />
                  <span className="font-medium text-gray-800">
                    {task.assign?.firstName} {task.assign?.lastName}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <button
                    className={`${getStatusStyle(
                      task.status
                    )} px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm`}
                    onClick={() => handleStatusClick(task)}
                    disabled={task.status === "Completed"}
                  >
                    {task.status}
                  </button>
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {task.createdBy?.firstName} {task.createdBy?.lastName}
                </td>

                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setIsModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition shadow-md"
                  >
                    <Eye size={18} /> View
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && selectedTask && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {selectedTask.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {selectedTask.description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToDoTable;
