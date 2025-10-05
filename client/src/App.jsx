import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/dashboard'
import Employee from './pages/employee.jsx'
import ViewEmployee from './pages/viewEmployee.jsx'
import Hrdashboard from './pages/Hrdashboard.jsx'
import StaffProfile from './pages/staffProfile.jsx';
import Staffdashboard from './pages/StaffDashboard.jsx'
import Profile from './pages/profile.jsx'
import AsignTask from './pages/asignTask.jsx'
import { Toaster } from 'react-hot-toast'
import ToDoTask from './pages/toDoTask.jsx'
import UpdateTask  from './pages/updateTask.jsx'
import Register from "./pages/register.jsx"
import ProtectedRoute from './middleware/ProtectedRoutes.jsx'


function App() {
  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-y-auto">
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["Admin", "HR"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hrdashboard"
            element={
              <ProtectedRoute allowedRoles={["HR"]}>
                <Hrdashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/staffdashboard"
            element={
              <ProtectedRoute allowedRoles={["Staff"]}>
                <Staffdashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/employee" element={
            <ProtectedRoute allowedRoles={["Admin", "HR"]}>
              <Employee />
            </ProtectedRoute>
          } />
          
          <Route path="/view"  element={ 
             <ProtectedRoute allowedRoles={["Admin", "HR"]}>
              <ViewEmployee />
             </ProtectedRoute>
            } />
          <Route  path="/profile"   element={
              <ProtectedRoute allowedRoles={["Admin", "HR"]}>
                  <Profile />
              </ProtectedRoute>
            } />
          <Route path="/asignTask" element={
            <ProtectedRoute allowedRoles={["Admin", "HR"]}>
                    <AsignTask />
            </ProtectedRoute>
            } />
          <Route path="/staffProfile" element={
            <ProtectedRoute allowedRoles={["Staff"]}>
               <StaffProfile />
            </ProtectedRoute>
            } />
          <Route path="/toDoTask" element={
             <ProtectedRoute allowedRoles={["Staff"]}>
                <ToDoTask />
             </ProtectedRoute>
            } />
          <Route path="/updatetask/:id"
           element={
            <ProtectedRoute allowedRoles={["Admin", "HR"]}>
              <UpdateTask />
            </ProtectedRoute>

           } />
        </Routes>
      </div>
    </div>
  );
}

export default App;
