import React, { useState, useEffect } from "react";
import axiosInstance  from "../lib/axios.js";
import Header from "../components/common/staffHeader.jsx";
import { motion } from "framer-motion";
import Record from "../components/common/record.jsx";
import { FaClock } from "react-icons/fa";
import { PiClockCountdownFill } from "react-icons/pi";
import { GrCompliance } from "react-icons/gr";
import Analytics from "../components/staffAnalytics/Analytics.jsx";

const StaffDashboard = () => {
  const [PendingTasks, setPendingTasks] = useState("0");
  const [InProgress, setInProgress] = useState("0");
  const [CompletedTasks, setCompletedTasks] = useState("0");

  useEffect(() => {
    const fetchPendingTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setPendingTasks(0);
      try {

        const { data } = await axiosInstance.get(
          "/task/userpendingtasks",
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPendingTasks(data.pendingTasks || "0");
      } catch (error) {
        setPendingTasks(0);
      }
    };
    fetchPendingTasks();
  }, []);

  useEffect(() => {
    const fetchInProgress = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setInProgress(0);
      try {

        const { data } = await axiosInstance.get(
          "/task/userinprogress",
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setInProgress(data.inProgressTasks || "0");
      } catch (error) {
        setInProgress(0);
      }
    };
    fetchInProgress();
  }, []);

  useEffect(() => {
    const fetchCompleted = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setCompletedTasks(0);
      try {
        const { data } = await axiosInstance.get(
          "/task/usercompletedtasks",
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCompletedTasks(data.completedTasks || "0");
      } catch (error) {
        setCompletedTasks(0);
      }
    };
    fetchCompleted();
  }, []);

  return (
    <div className="min-h-screen dark:bg-gray-950 bg-gray-50 text-gray-900 dark:text-gray-100 transition-all duration-300">
      <div className="relative z-10 flex flex-col shadow-md">
        <Header title="Dashboard" />
      </div>

      <main className="max-w-7xl mx-auto py-10 px-4 lg:px-8">
        <motion.div
          className="grid gap-6 sm:grid-cols-3 mb-10"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Record
            name="Pending Task"
            value={PendingTasks}
            icon={FaClock}
            color="#fbbf24"
          />
          <Record
            name="In Progress Task"
            value={InProgress}
            icon={PiClockCountdownFill}
            color="#3b82f6"
          />
          <Record
            name="Completed Task"
            value={CompletedTasks}
            icon={GrCompliance}
            color="#22c55e" 
          />
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-xl font-semibold mb-4">Task Analytics</h2>
          <Analytics />
        </motion.div>
      </main>
    </div>
  );
};

export default StaffDashboard;
