import React, { useState, useEffect, useRef } from "react";
import Profile from "../../assets/profile.jpg";
import axios from "axios";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Printer, CheckCircle2, Loader2 } from "lucide-react";
import { FaClockRotateLeft, FaClock } from "react-icons/fa6";
import DeleteModal from "../../Modal/deleteTaskModal.jsx";
import ExportTasksPreview from "./ExportTasksPreview.jsx"; // Import the component

const ViewTable = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Assigned-Tasks",
  });

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/task/getallassignedtasks",
          { withCredentials: true }
        );
        setStaff(res.data.tasks || []);
      } catch (err) {
        console.error("Error fetching tasks", err);
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

  return (
    <div className="w-full p-4 bg-neutral-100 rounded-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded-2xl shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-800">📋 Assigned Tasks</h2>
        <div className="flex items-center gap-3 mt-3 md:mt-0">
          {/* Print button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow transition bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Printer className="h-4 w-4" /> Print Table
          </button>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search staff..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <svg
              className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 20 20"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
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
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : filteredStaff.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6">
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
                    <span className="font-medium">{task.assign?.firstName} {task.assign?.lastName}</span>
                  </td>
                  <td className="px-6 py-4">{task.assign?.role || "N/A"}</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(task.status)}`}>
                      {getStatusIcon(task.status)}
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/updatetask/${task._id}`}
                        state={{ title: task.title, description: task.description, assign: task.assign?._id }}
                        className="px-3 py-1 rounded-lg text-sm bg-blue-500 text-white hover:bg-blue-600 transition"
                      >
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

      {/* Hidden component for printing */}
      <div className="hidden">
        <ExportTasksPreview ref={printRef} tasks={filteredStaff} />
      </div>
    </div>
  );
};

export default ViewTable;
