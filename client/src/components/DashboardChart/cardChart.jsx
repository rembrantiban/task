import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import Card from "../../components/common/Card";
import axios from "axios";

const COLORS = ["#3B82F6", "#F59E0B", "#10B981"]; 

const DashboardRecharts = () => {
  const [completed, setCompleted] = useState(0);
  const [pending, setPending] = useState(0);
  const [inprogress, setInProgress] = useState(0);

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/task/completedtasks", { withCredentials: true });
        setCompleted(res.data.completedTasks || 0);
      } catch {
        setCompleted(0);
      }
    };
    fetchCompleted();
  }, []);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/task/pendingtasks");
        setPending(res.data.pendintasks || 0);
      } catch {
        setPending(0);
      }
    };
    fetchPending();
  }, []);

  useEffect(() => {
    const fetchInProgress = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/task/inprogress");
        setInProgress(res.data.inprogress || 0);
      } catch {
        setInProgress(0);
      }
    };
    fetchInProgress();
  }, []);

  const data = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pending },
    { name: "In Progress", value: inprogress },
  ];

  return (
    <div className="flex flex-col items-center px-4 sm:px-6 lg:px-12 py-10 font-sans bg-gray-50 rounded-2xl shadow-lg w-full">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center">
        📊 Staff Management Analytics
      </h2>
      <p className="text-gray-500 text-sm text-center">
        Overview of task distribution and progress
      </p>

      <div className="flex flex-col lg:flex-row gap-10 mt-10 w-full">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 flex-1">
          <Card title="Tasks Completed" value={completed} color="bg-green-500" />
          <Card title="Pending Tasks" value={pending} color="bg-yellow-500" />
          <Card title="In Progress Tasks" value={inprogress} color="bg-blue-500" />
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center lg:text-left">
            Task Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "0.75rem",
                  border: "1px solid #ddd",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardRecharts;
