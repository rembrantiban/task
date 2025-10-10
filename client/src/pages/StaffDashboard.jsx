import React, { useState, useEffect } from "react";
import axiosInstance  from "../lib/axios.js";
import Header from "../components/common/staffHeader.jsx";
import { motion } from "framer-motion";
import Record from "../components/common/record.jsx";
import { FaClock } from "react-icons/fa";
import { PiClockCountdownFill } from "react-icons/pi";
import { GrCompliance } from "react-icons/gr";
import Analytics from "../components/staffAnalytics/Analytics.jsx";
import WeeklyAnalytics from "../components/staffAnalytics/weeklyAnalytics.jsx";

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
          className="grid gap-1 sm:grid-cols-3 mb-5"
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
          className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-800 
             hover:shadow-xl transition-all duration-300"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Task Analytics
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Get an overview of your task progress — track how many tasks are pending, in progress, 
                or completed in real-time.
              </p>
            </div>

            <span className="mt-3 sm:mt-0 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full">
              Updated live
            </span>
          </div>
             <div className="p-6 space-y-6">
      {/* Other dashboard cards */}
      <WeeklyAnalytics />
      <Analytics />
    </div>
         
            
         
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <p>
              <span className="font-semibold text-gray-800 dark:text-gray-200">Total Tasks:</span>{" "}
              Automatically fetched from your activity.
            </p>
            <p className="italic text-gray-500 dark:text-gray-400">Last updated a few seconds ago</p>
          </div>
        </motion.div>

      </main>
    </div>
  );
};

export default StaffDashboard;
