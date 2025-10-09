import React, { useState, useEffect } from "react";
import Profile from "../../assets/profile.jpg";
import axiosInstance from "../../lib/axios.js";
import { Link } from "react-router-dom";
import { FaClockRotateLeft, FaClock } from "react-icons/fa6";
import { CheckCircle2, Loader2, X, Pencil  } from "lucide-react"; 
import DeleteModal from "../../Modal/deleteTaskModal.jsx";
import ExportTasksPreview from "../Document/ExportTasksPreview.jsx";
import toast from "react-hot-toast";

const ViewTable = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [savingComment, setSavingComment] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); 
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axiosInstance.get(
          "/task/getallassignedtasks",
          { withCredentials: true }
        );
        setStaff(res.data.tasks || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const filteredStaff = staff.filter(
    (user) =>
      (user.assign?.firstName || "")
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase()) ||
      (user.assign?.lastName || "")
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <FaClock />;
      case "In Progress":
        return <FaClockRotateLeft />;
      case "Completed":
        return <CheckCircle2 />;
      default:
        return null;
    }
  };

 const handleSaveComment = async (taskId, comment) => {
  try {
    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    
    setSavingComment(taskId);

      await axiosInstance.put(
      `/task/addcomment/${taskId}`,
      { comment },
      { withCredentials: true }
    );
    
    setStaff((prev) =>
      prev.map((t) =>
        t._id === taskId ? { ...t, comment: "" } : t
      )
    );

    toast.success("Comment saved successfully");
  } catch (err) {
    console.error("Failed to save comment:", err);
    toast.error("Failed to save comment");
  } finally {
    setSavingComment(null);
  }
};

  return (
    <div className="w-full p-4 bg-neutral-100 rounded-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded-2xl shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-800">📋 Assigned Tasks</h2>
        <div className="relative flex mt-3 md:mt-0 gap-2">
          <ExportTasksPreview tasks={filteredStaff} currentuserrole={currentUser?.role} />
          <input
            type="text"
            placeholder="Search staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-3 pr-4 py-2 h-10 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl shadow-lg bg-white">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs uppercase bg-gray-100 text-gray-600">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Position</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Proof</th>
              <th className="px-6 py-3">Comment</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  <Loader2 className="animate-spin h-5 w-5 mx-auto text-blue-500" />
                </td>
              </tr>
            ) : filteredStaff.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  No staff task found
                </td>
              </tr>
            ) : (
              filteredStaff.map((task) => (
                <tr key={task._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={task.assign?.image || Profile}
                      alt="User"
                    />
                   <div className="flex flex-col">
                     <span className="font-medium">{task.assign?.firstName} {task.assign?.lastName}</span>
                     <span className="text-xs text-gray-500">{task.assign?.email}</span>
                   </div>
                  </td>

                  {/* Position */}
                  <td className="px-6 py-4">{task.assign?.role || "N/A"}</td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(task.status)}`}>
                      {getStatusIcon(task.status)}
                      {task.status}
                    </span>
                  </td>

                  {/* Proof (clickable) */}
                  <td className="px-6 py-4">
                    <img
                      onClick={() => setSelectedImage(task.proofUrl)}
                      className="w-14 h-14 rounded-lg object-cover border cursor-pointer hover:scale-105 transition"
                      src={task.proofUrl}
                      alt="No Proof"
                    />
                  </td>

                  {/* Comment */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <textarea
                         value={task.comment || ""}
                          onChange={(e) =>
                            setStaff((prev) =>
                              prev.map((t) =>
                                t._id === task._id ? { ...t, comment: e.target.value } : t
                              )
                            )
                          }
                        className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="Add comment..."
                        rows={2}
                      />
                      <button
                        onClick={() => handleSaveComment(task._id, task.comment || "")}
                        disabled={savingComment === task._id}
                        className={`px-3 py-1 text-sm rounded-md text-white ${
                          savingComment === task._id
                            ? "bg-gray-400"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {savingComment === task._id ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/updatetask/${task._id}`}
                        state={{ title: task.title, description: task.description, assign: task.assign?._id }}
                        className="px-3 py-1 w-20 flex justify-center items-center   rounded-sm text-sm bg-blue-500 text-white hover:bg-blue-600 transition"
                      >
                        <Pencil size={15} />
                        Edit
                      </Link>
                      <DeleteModal
                        taskId={task._id}
                        onDeleteSuccess={(deletedId) =>
                          setStaff((prev) => prev.filter((t) => t._id !== deletedId))
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg max-w-3xl max-h-[90vh]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage}
              alt="Proof"
              className="rounded-lg max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTable;
