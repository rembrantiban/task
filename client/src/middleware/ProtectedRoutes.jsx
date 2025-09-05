import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem("userRole"); 

  if (!role) {
    return <Navigate to="/" replace />; 
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />; 
  }

  return children;
};

export default ProtectedRoute;
