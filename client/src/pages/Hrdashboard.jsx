import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Users, Layers, NotebookPen } from 'lucide-react';
import StatCard from '../components/common/statcard.jsx';
import Header from '../components/common/header.jsx';
import Piechart from '../components/DashboardChart/piechart.jsx'
import CardChart from '../components/DashboardChart/cardChart.jsx'

const Hrdashboard = () => {
  return (
    <div className="min-h-screen  dark:bg-gray-800 text-gray-800 dark:text-white">
      <div className="relative z-10 flex flex-col">
        <Header title="Dashboard" />
      </div>
      <main className="max-w-7xl mx-auto py-8 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="No. Position" icon={Layers} value={100} color="#6" />
          <StatCard name="Users" icon={Users} value={250} color="#10B981" />
          <StatCard name="Projects" icon={BarChart2} value={12} color="#F59E42" />
          <StatCard name="Notes" icon={NotebookPen} value={42} color="#EF4444" />
        </motion.div>
        {/* Charts */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-1 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Card Chart Card */}
          <div className=" dark:bg-gray-800 flex flex-col items-center shadow-2xl rounded-2xl p-8">
            <h2 className="mb-6 text-xl font-semibold text-center dark:text-white">Staff Management Analytics</h2>
            <div className="flex-1 flex items-center justify-center w-full">
              <CardChart />
            </div>
          </div>
          {/* Pie Chart Card */}
          <div className=" dark:bg-gray-800 flex flex-col items-center shadow-2xl rounded-2xl p-8 h-[500px] w-[500px]">
            <h2 className="mb-6 text-xl font-semibold text-center  dark:text-white">Staff Count per Department</h2>
            <div className="flex-1 flex items-center justify-center w-full">
              <Piechart />
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Hrdashboard;