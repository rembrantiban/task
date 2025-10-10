import React, { useEffect, useState } from "react";
import { Eye, X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axiosInstance from "../../lib/axios";

const ToDoTable = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    axiosInstance
      .get(`/task/getuserassign/${userId}`)
      .then((res) => setTasks(res.data.tasks || []))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch tasks");
        setTasks([]);
      });
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
      await axiosInstance.put(`/task/updatestatus`, {
        taskId: task._id,
        status: nextStatus,
      });
      setTasks((tasks) =>
        tasks.map((t) =>
          t._id === task._id ? { ...t, status: nextStatus } : t
        )
      );
      toast.success(`Task marked as ${nextStatus}`);
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update task status");
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      Pending: "bg-amber-100 text-amber-700 border border-amber-300",
      "In Progress": "bg-blue-100 text-blue-700 border border-blue-300",
      Completed: "bg-green-100 text-green-700 border border-green-300",
    };
    return styles[status] || "bg-gray-100 text-gray-700 border border-gray-300";
  };

  const handleUpload = async () => {
    if (!file || !selectedTask) {
      toast.error("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("proofImage", file);

    try {
      setUploading(true);

      const res = await axiosInstance.put(
        `/task/updateproofimage/${selectedTask._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      setTasks((prev) =>
        prev.map((t) => (t._id === selectedTask._id ? res.data : t))
      );
      setSelectedTask(res.data);
      setFile(null);
      toast.success("Proof image uploaded successfully");
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Failed to upload proof image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-200 rounded">
      <div className="overflow-y-auto rounded-2xl shadow-xl bg-white">
        <div className="flex from-gray-200 to-gray-300 rounded p-5 md:flex-row justify-between items-center gap-4">
         <div>
           <h2 className="text-xl font-semibold text-gray-800 dark:text-white">🗓️ My To-Do List</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Here are your assigned tasks. You can update their status, upload proof of completion, or view details for each one.
          </p>
         </div>
          </div>

        <table className="w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-gray-200 to-gray-300 text-black text-sm uppercase tracking-wide">
            <tr>
              <th className="px-6 py-3">Employee</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Comments</th>
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
                    src={task.assign?.image || "/default-avatar.png"}
                    alt="User"
                    className="w-12 h-12 rounded-full border-2 border-indigo-500 shadow-sm object-cover"
                  />
                  <span className="font-medium text-gray-800">
                    {task.assign?.firstName} {task.assign?.lastName}
                  </span>
                </td>

                {/* Status */}
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

                {/* Comments */}
                <td className="px-6 py-4">
                  <div className="max-h-32 overflow-y-auto pr-2">
                    {Array.isArray(task.comments) && task.comments.length > 0 ? (
                      task.comments.map((comment, index) => (
                        <div key={index} className="mb-2 last:mb-0">
                          <div className="flex items-center gap-2 mb-1">
                            <img
                              src={
                                comment?.commentedBy?.image ||
                                "/default-avatar.png"
                              }
                              alt="User"
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-sm font-medium text-gray-800">
                              {comment?.commentedBy
                                ? `${comment.commentedBy.firstName} ${comment.commentedBy.lastName}`
                                : "Unknown User"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {comment?.text || "No text provided"}
                          </p>
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">
                        No comments yet
                      </span>
                    )}
                  </div>
                </td>

                {/* Assigned By */}
                <td className="px-6 py-4 text-gray-600">
                  {task.createdBy?.firstName} {task.createdBy?.lastName}
                </td>

                {/* Action */}
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
              {/* Close */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {selectedTask.title}
              </h3>
              <p className="text-gray-600 mb-4">{selectedTask.description}</p>

              {/* File Upload */}
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
