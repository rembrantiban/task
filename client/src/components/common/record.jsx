import React from "react";
import { motion } from "framer-motion";

const Record = ({ name, value, icon: Icon, color }) => {
  return (
    <motion.div
      className="relative flex flex-col justify-center items-center bg-white dark:bg-gray-900 
        rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700
        h-36 w-72 sm:h-40 sm:w-80 md:h-44 md:w-96 p-6 transition-all duration-300"
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      {/* Icon Circle */}
      <div
        className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-md"
        style={{
          background: `linear-gradient(135deg, ${color}33, ${color})`,
        }}
      >
        <Icon className="text-white w-7 h-7 sm:w-8 sm:h-8" />
      </div>

      {/* Title */}
      <span className="mt-4 text-base sm:text-lg md:text-xl font-medium text-gray-700 dark:text-gray-300">
        {name}
      </span>

      {/* Value */}
      <p className="mt-1 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </motion.div>
  );
};

export default Record;
