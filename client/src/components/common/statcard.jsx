import { motion } from "framer-motion";
import React from "react";

const StatCard = ({ name, icon: Icon, value, color, background }) => {
  return (
    <motion.div
      className="flex flex-col justify-between p-6 rounded-2xl shadow-xl text-white 
                 transition-all duration-300"
      style={{
        width: "280px",
        height: "170px",
        background: background || color,
      }}
      whileHover={{ y: -10, scale: 1.05 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-full flex items-center justify-center bg-white/20 shadow-md">
            <Icon size={26} />
          </div>
          <h3 className="text-lg font-semibold opacity-90">{name}</h3>
        </div>
      </div>


      <div className="mt-6 flex justify-center">
        <p className="text-5xl font-extrabold tracking-tight drop-shadow-md">
          {value}
        </p>
      </div>
    </motion.div>
  );
};

export default StatCard;
