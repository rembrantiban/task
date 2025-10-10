import { motion } from "framer-motion";

const Card = ({ title, value, icon: Icon, className = "" }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={`relative overflow-hidden rounded-2xl p-6 bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md backdrop-blur-md ${className}`}
  >
    {/* Decorative gradient line at the top */}
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-2xl" />

    <div className="flex items-center justify-between">
      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h4>
      {Icon && <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500" />}
    </div>

    <p className="mt-3 text-3xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
      {value}
    </p>
  </motion.div>
);

export default Card;
    