import React, { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const COLORS = ["#F59E0B", "#3B82F6", "#10B981"];

const TaskAnalytics = () => {
  const [pendingTasks, setPendingTasks] = useState(0);
  const [inProgressTasks, setInProgressTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const [pendingRes, progressRes, completedRes] = await Promise.all([
          axiosInstance.get("/task/userpendingtasks", {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }),
          axiosInstance.get("/task/userinprogress", {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }),
          axiosInstance.get("/task/usercompletedtasks", {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }),
        ]);

        setPendingTasks(pendingRes.data.pendingTasks || 0);
        setInProgressTasks(progressRes.data.inProgressTasks || 0);
        setCompletedTasks(completedRes.data.completedTasks || 0);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const data = [
    { name: "Pending", value: pendingTasks },
    { name: "In Progress", value: inProgressTasks },
    { name: "Completed", value: completedTasks },
  ];

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/70 
                 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-3xl p-8 
                 shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-[420px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring" }}
    >
      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Task Analytics
      </h2>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-[250px]">
          <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
        </div>
      ) : (
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <linearGradient id="grad-pending" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
                <linearGradient id="grad-progress" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
                <linearGradient id="grad-completed" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>

              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={4}
                cornerRadius={8}
              >
                <Cell fill="url(#grad-pending)" />
                <Cell fill="url(#grad-progress)" />
                <Cell fill="url(#grad-completed)" />
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                labelStyle={{ color: "#555" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Custom Legend */}
      {!loading && (
        <div className="flex justify-around w-full mt-6 text-sm font-medium">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: COLORS[index] }}
              ></span>
              <span className="text-gray-700 dark:text-gray-300">
                {item.name}:{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {item.value}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default TaskAnalytics;
