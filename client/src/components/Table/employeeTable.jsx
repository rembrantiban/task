import React, { useEffect, useState, useRef } from "react";
import Profile from "../../assets/profile.jpg";
import CreateModal from "../../Modal/createModal.jsx";
import axios from "axios";
import DeleteModal from "../../Modal/deleteModal.jsx";
import { PrinterCheck, Search, Eye, X } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { PDFDownloadLink } from "@react-pdf/renderer";   // ✅ Import this
import AssignedTasksPdf from "../Document/AssignedTasksPdf.jsx"; // ✅ Import your PDF component

const EmployeeTable = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);

  const printRef = useRef();

  // Print handler
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "staff-list",
    onAfterPrint: () => console.log("Print success"),
  });

  // Search debounce
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  // Fetch staff
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/user/getallstaff",
          { withCredentials: true }
        );
        setStaff(res.data.users || []);
      } catch (error) {
        console.error("Failed to fetch staff:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const filteredStaff = staff.filter(
    (user) =>
      user.firstName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      user.lastName.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6 text-gray-900 dark:text-white">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <CreateModal />

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              placeholder="Search staff..."
            />
          </div>

          {/* Export PDF */}
          <PDFDownloadLink
            document={<AssignedTasksPdf tasks={filteredStaff} />} // ✅ Pass filtered staff here
            fileName="staff-list.pdf"
          >
            {({ loading }) => (
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? "Preparing..." : "Export PDF"}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      {/* Table */}
      <div
        ref={printRef}
        className="p-6 overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <table className="w-full text-sm text-left">
          <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Position</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  Loading...
                </td>
              </tr>
            ) : filteredStaff.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center font-medium py-6 text-gray-600 dark:text-gray-300"
                >
                  No matching staff found.
                </td>
              </tr>
            ) : (
              filteredStaff.map((user, index) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="flex items-center gap-3 px-6 py-4">
                    <img
                      className="w-10 h-10 rounded-full object-cover shadow-sm"
                      src={user.image || Profile}
                      alt={user.firstName}
                    />
                    <div>
                      <div className="font-semibold">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{user.role}</td>
                  <td className="px-6 py-4">{user.phone}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setViewOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-medium flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                    <DeleteModal
                      userId={user._id}
                      onDeleteSuccess={(id) =>
                        setStaff((prev) => prev.filter((u) => u._id !== id))
                      }
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[400px] p-6 relative animate-fade-in">
            <button
              onClick={() => setViewOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>

            <div className="flex flex-col items-center text-center space-y-3">
              <img
                src={selectedUser.image || Profile}
                alt={selectedUser.firstName}
                className="w-24 h-24 rounded-full object-cover shadow-md"
              />
              <h2 className="text-lg font-bold">
                {selectedUser.firstName} {selectedUser.lastName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedUser.role}
              </p>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div>
                <span className="font-medium">Email:</span>{" "}
                {selectedUser.email}
              </div>
              <div>
                <span className="font-medium">Phone:</span>{" "}
                {selectedUser.phone}
              </div>
              <div>
                <span className="font-medium">ID:</span> {selectedUser._id}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
