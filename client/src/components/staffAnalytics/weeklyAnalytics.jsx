import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { CheckCircle2, Clock4, TrendingUp } from "lucide-react";
import axiosInstance from "../../lib/axios";

const WeeklyAnalytics = () => {
  const [weeklyCompleted, setWeeklyCompleted] = useState(0);
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axiosInstance.get("/task/userweeklycompleted", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        setWeeklyCompleted(data.weeklyCompletedTasks || 0);

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const mockData = days.map((day, i) => ({
          name: day,
          completed: Math.floor(Math.random() * 3), 
        }));
        setWeeklyData(mockData);
      } catch (err) {
        console.error("Error fetching weekly analytics:", err);
      }
    };
    fetchWeeklyData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 w-full"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Weekly Task Analytics
        </h2>
        <TrendingUp className="text-indigo-500 w-6 h-6" />
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-4 bg-indigo-100 dark:bg-indigo-950 rounded-xl flex flex-col items-center justify-center"
        >
          <Clock4 className="text-indigo-500 w-6 h-6 mb-2" />
          <p className="text-sm text-gray-500">This Week</p>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {weeklyCompleted}
          </h3>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-4 bg-green-100 dark:bg-green-950 rounded-xl flex flex-col items-center justify-center"
        >
          <CheckCircle2 className="text-green-500 w-6 h-6 mb-2" />
          <p className="text-sm text-gray-500">Goal Progress</p>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {Math.min((weeklyCompleted / 10) * 100, 100).toFixed(0)}%
          </h3>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-4 bg-purple-100 dark:bg-purple-950 rounded-xl flex flex-col items-center justify-center"
        >
          <TrendingUp className="text-purple-500 w-6 h-6 mb-2" />
          <p className="text-sm text-gray-500">Performance</p>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {weeklyCompleted >= 5 ? "🔥 Excellent" : "⚡ Keep Going"}
          </h3>
        </motion.div>
      </div>

      {/* Bar Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="name" stroke="#888" />
            <Tooltip />
            <Bar dataKey="completed" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Motivation Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400"
      >
        {weeklyCompleted >= 7
          ? "🌟 Incredible! You’re smashing your weekly goals!"
          : weeklyCompleted >= 3
          ? "🔥 Great progress! Keep pushing forward!"
          : "🚀 Let’s make the rest of the week count!"}
      </motion.p>
    </motion.div>
  );
};

export default WeeklyAnalytics;
