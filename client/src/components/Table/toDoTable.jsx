import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast"

const ToDoTable = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [file, setFile] = useState(null); 
  const [uploading, setUploading] = useState(false); 

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

const handleUpload = async () => {
  if (!file || !selectedTask) return;

  const formData = new FormData();
  formData.append("proofImage", file); 

  try {
    setUploading(true);
    const res = await axios.put(
      `http://localhost:5000/api/task/updateproofimage/${selectedTask._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true, 
        }
    );

    setTasks((prev) =>
      prev.map((t) =>
        t._id === selectedTask._id ? res.data : t
      )
    );
    setSelectedTask(res.data); 
    setFile(null);
    toast.success("image Proof uploaded Successfully")
  } catch (err) {
    console.error("Upload failed:", err);
  } finally {
    setUploading(false);
  }
};

  return (
    <div className="p-6 bg-gray-200 rounded">
      <div className="overflow-hidden rounded-2xl shadow-xl bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-gray-900 to-gray-950 text-white text-sm uppercase tracking-wide">
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

      {/* Modal */}
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
              {/* Close button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>

              {/* Task Info */}
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {selectedTask.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                {selectedTask.description}
              </p>

              {/* File Upload UI */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <label className="block mb-2 font-medium text-gray-700">
                  Upload Proof File
                </label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                             file:rounded-full file:border-0 file:text-sm file:font-semibold
                             file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />

                {file && file.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="mt-3 w-32 h-32 object-cover rounded-md border"
                  />
                )}

                <button
                  onClick={handleUpload}
                  disabled={uploading || !file}
                  className={`mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white ${
                    uploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-500"
                  }`}
                >
                  <Upload size={18} />
                  {uploading ? "Uploading..." : "Upload Proof"}
                </button>
              </div>

              {selectedTask.proofImage && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Current Proof:</h4>
                  <img
                    src={selectedTask.proofImage}
                    alt="proof"
                    className="w-40 h-40 object-cover rounded-md border"
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToDoTable;
