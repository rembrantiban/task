import React, { useEffect, useState, useRef, useMemo } from "react";
import Profile from "../../assets/profile.jpg";
import axiosInstance from "../../lib/axios.js";
import DeleteModal from "../../Modal/deleteModal.jsx";
import UpdateUserModal from "../../Modal/updateUserModal.jsx";
import {
  Search,
  Eye,
  X,
  ArrowUpDown,
  FileSpreadsheet,
  Users,
  Shield,
  UserCheck,
} from "lucide-react";
import * as XLSX from "xlsx";

const EmployeeTable = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("All");

  const printRef = useRef();
  const itemsPerPage = 6;

  // --- Debounce search ---
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  // --- Fetch Staff ---
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axiosInstance.get("/user/getallstaff", {
          withCredentials: true,
        });
        setStaff(res.data.users || []);
      } catch (error) {
        console.error("Failed to fetch staff:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  // --- Role Filter Options ---
  const roles = useMemo(() => {
    const uniqueRoles = Array.from(new Set(staff.map((u) => u.role)));
    return ["All", ...uniqueRoles];
  }, [staff]);

  // --- Filtered, Sorted, and Paginated Data ---
  const filteredStaff = staff.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      user.lastName.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesRole =
      roleFilter === "All" || user.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const sortedStaff = [...filteredStaff].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const order = sortConfig.direction === "asc" ? 1 : -1;
    if (a[sortConfig.key] < b[sortConfig.key]) return -1 * order;
    if (a[sortConfig.key] > b[sortConfig.key]) return 1 * order;
    return 0;
  });

  const totalPages = Math.ceil(sortedStaff.length / itemsPerPage);
  const paginatedStaff = sortedStaff.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- Sorting Handler ---
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // --- Export to Excel ---
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredStaff.map((user, i) => ({
        "#": i + 1,
        Name: `${user.firstName} ${user.lastName}`,
        Role: user.role,
        Phone: user.phone,
        Email: user.email,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    XLSX.writeFile(wb, "Employee_List.xlsx");
  };

  // --- Summary Counts ---
  const totalEmployees = staff.length;
  const totalAdmins = staff.filter((u) => u.role.toLowerCase() === "admin").length;
  const totalStaff = staff.filter((u) => u.role.toLowerCase() === "staff").length;

  return (
    <div className="w-full max-w-7xl mx-auto p-6 overflow-y-auto bg-neutral-100 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col bg-gray-200 rounded p-5 md:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Employee Management</h1>
          <p className="text-gray-600 mb-6">
            Manage all employee information, update profiles, and monitor
            activity here.
          </p>
        </div>

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

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
          >
            {roles.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>

          {/* Export */}
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Employees</p>
            <h3 className="text-lg font-semibold">{totalEmployees}</h3>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
            <Shield className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Admins</p>
            <h3 className="text-lg font-semibold">{totalAdmins}</h3>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
            <UserCheck className="w-6 h-6 text-green-600 dark:text-green-300" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Staff</p>
            <h3 className="text-lg font-semibold">{totalStaff}</h3>
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        ref={printRef}
        className="p-6 overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
      >
        <table className="w-full text-sm text-left">
          <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">#</th>
              <th
                className="px-6 py-3 cursor-pointer select-none"
                onClick={() => handleSort("firstName")}
              >
                Name <ArrowUpDown className="inline w-3 h-3 ml-1" />
              </th>
              <th
                className="px-6 py-3 cursor-pointer select-none"
                onClick={() => handleSort("role")}
              >
                Position <ArrowUpDown className="inline w-3 h-3 ml-1" />
              </th>
              <th
                className="px-6 py-3 cursor-pointer select-none"
                onClick={() => handleSort("phone")}
              >
                Phone <ArrowUpDown className="inline w-3 h-3 ml-1" />
              </th>
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
            ) : paginatedStaff.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center font-medium py-6 text-gray-600 dark:text-gray-300"
                >
                  No matching staff found.
                </td>
              </tr>
            ) : (
              paginatedStaff.map((user, index) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-4 py-3">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="flex items-center gap-3 px-6 py-4">
                    <img
                      className="w-10 h-10 rounded-full object-cover shadow-sm"
                      src={user.image || Profile}
                      alt={user.firstName}
                      loading="lazy"
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
                    <UpdateUserModal
                      userId={user._id}
                      onUpdateSuccess={(updatedUser) => {
                        setStaff((prev) =>
                          prev.map((u) =>
                            u._id === updatedUser._id ? updatedUser : u
                          )
                        );
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1.5 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded disabled:opacity-50 text-sm"
            >
              Prev
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1.5 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded disabled:opacity-50 text-sm"
            >
              Next
            </button>
          </div>
        )}
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
                <span className="font-medium">Email:</span> {selectedUser.email}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {selectedUser.phone}
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
