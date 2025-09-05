


const Card = ({ title, value, className = "" }) => (
  <div
    className={`border border-gray-200 dark:border-gray-700 rounded-lg p-6 min-w-[150px] text-center shadow  dark:bg-gray-800 ${className}`}
  >
    <h4 className="mb-2 dark:text-gray-200">{title}</h4>
    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{value}</p>
  </div>
);

export default Card;