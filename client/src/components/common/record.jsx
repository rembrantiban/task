import React from "react";
import { motion } from "framer-motion";

const Record = ({ name, value, icon: Icon, color }) => {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="relative overflow-hidden flex flex-col items-center justify-center rounded-3xl 
                 bg-white/80 dark:bg-gray-900/70 backdrop-blur-md border border-gray-200 
                 dark:border-gray-800 shadow-md hover:shadow-xl transition-all duration-300 
                 p-6 sm:p-8 w-90 h-40 sm:h-44 md:h-40"
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(circle at top, ${color}, transparent 70%)`,
        }}
      />

      <div
        className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${color}, ${color}aa)`,
          boxShadow: `0 0 20px ${color}40`,
        }}
      >
        <Icon className="text-white w-7 h-7 sm:w-8 sm:h-8" />
      </div>

      <span className="mt-4 text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 tracking-wide">
        {name}
      </span>

      <p
        className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight"
        style={{ color }}
      >
        {value}
      </p>

      <div
        className="absolute bottom-0 left-0 right-0 h-1 rounded-b-3xl"
        style={{
          background: `linear-gradient(to right, ${color}, transparent)`,
        }}
      />
    </motion.div>
  );
};

export default Record;
