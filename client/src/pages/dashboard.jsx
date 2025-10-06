import { motion } from "framer-motion";
import { BarChart2, Users, Layers, NotebookPen } from "lucide-react";
import StatCard from "../components/common/statcard.jsx";
import Header from "../components/common/header.jsx";
import CardChart from "../components/DashboardChart/cardChart.jsx";
import { useEffect, useState } from "react";

import axiosInstance from "../lib/axios.js";


const Dashboard = () => {
  const [users, setUser] = useState("0");
  const [tasks, setTasks] = useState("0");
  const [totalTask, setTotalTask ] = useState("0");

  useEffect(() =>  {
  const fetchtotalTask = async () => {
       try{
          const response = await axiosInstance.get("/title/gettotaltask")  
          setTotalTask(response.data.totalTask || "0");
          console.log(response.data.totalTask); 
     }
     catch(error){
        console.error("Error while Fetching tasks", error)
     } 
    };

    fetchtotalTask();
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          "/user/totalstaff"
        );
        setUser(response.data.totalStaff || "0");
        console.log(response.data.totalStaff);
      } catch (error) {
        console.warn("Error while fetching users", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get(
          "/task/totaltask"
        );
        setTasks(response.data.totalTask || "0");
        console.log(response.data.totalTask);
      } catch (error) {
        console.error("Error while fetching number of tasks", error);
      }
    };
    setTimeout(() => {
      fetchTasks();
    }, 1000);
  }, []);

  return (
    <div className="flex-1 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="relative flex flex-col">
        <Header title="Dashboard" />
      </div>

      <main className="max-w-7xl mx-auto py-8 px-4 lg:px-8">
        <motion.div
          className="flex mb-10 sm:flex-row flex-col gap-4 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
        <StatCard
            name="No. Assign Tasks"
            icon={Layers}
            value={tasks}
            color="#ffffff"
            background="linear-gradient(135deg, #6366F1, #3B82F6)" 
          />
          <StatCard
            name="Users"
            icon={Users}
            value={users}
            color="#ffffff"
            background="linear-gradient(135deg, #10B981, #059669)" 
          />
          <StatCard
            name="No. Task"
            icon={BarChart2}
            value={totalTask}
            color="#ffffff"
            background="linear-gradient(135deg, #F59E0B, #D97706)" 
          />
          <StatCard
            name="Notes"
            icon={NotebookPen}
            value={42}
            color="#ffffff"
            background="linear-gradient(135deg, #EC4899, #DB2777)" 
          />
        </motion.div>

        <motion.div
          className="flex gap-8 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex-1 flex items-center shadow-2xl rounded-2xl ">
            <CardChart />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
