import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#f39c12', '#3498db', '#2ecc71'];

const TaskAnalytics = () => {
  const [ pendingTasks, setPendingTasks ] = useState("0");
  const [ inProgressTasks, setInProgressTasks ] = useState("0");
  const [ completedTasks, setCompletedTasks ] = useState("0");
  
useEffect(() => {
  const fetchPendingTasks = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage. User might not be logged in.');
      setPendingTasks(0);
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/task/userpendingtasks', {
        withCredentials:true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("PendingTasks Count:", response.data.pendingTasks);
      setPendingTasks(response.data.pendingTasks || "0");

    } catch (error) {
      console.error("Error fetching user Pending tasks:", error);
      setPendingTasks(0);
    }
  };
   fetchPendingTasks();
}, []);


useEffect(() => {
      const fetchingInprogress = async () => {
            const token = localStorage.getItem('token');
          try{
              const response =  await axios.get('http://localhost:5000/api/task/userinprogress',{
                 withCredentials: true,
                 headers: {
                    Authorization: `Bearer ${token}`,
                 }
              })
             console.log("In Progress Task Count :", response.data.inProgressTasks )
             setInProgressTasks(response.data.inProgressTasks  || "0")

          }
          catch(error){
             console.log("Error while Fetching In Progress", error)
             setInProgressTasks(0)
          }
      }
      fetchingInprogress();
 }, []);

 useEffect(() => {
       const fetchingCompletedTasks = async () => {
           const token = localStorage.getItem('token');
         try{
            const response = await axios.get('http://localhost:5000/api/task/usercompletedtasks',
                { withCredentials: true, 
                  headers: {
                    Authorization: `Bearer ${token}`,
                  }
                }
            )
           console.log("Completed Tasks Count :", response.data.completedTasks);
           setCompletedTasks(response.data.completedTasks || "0");
         }  
         catch(error){
             console.log("Error while Fetching Completed Tasks", error);
             setCompletedTasks(0);
         }  
       }
       fetchingCompletedTasks();
    }, []);



  const data = [
    { name: 'Pending', value: pendingTasks},
    { name: 'In Progress', value: inProgressTasks},
    { name: 'Completed', value: completedTasks},
  ];

  return (
    <div className="task-analytics-wrapper">
      <h2 style={{ textAlign: 'center' }} className='dark:text-white'>Task Analytics</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskAnalytics;
