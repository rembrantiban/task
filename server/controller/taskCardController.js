import taskModel from "../models/taskModel.js";
import mongoose from  "mongoose";

 export const getCompletedTask = async (req, res) => {
            console.log(" getCompletedTask controller hit");

        try{
            const completedTasks = await taskModel.countDocuments({ status: "Completed" });
            if(completedTasks === 0){
                return res.status(404).json({ 
                    success: false, 
                    message: "No completed tasks found"});
            }
            return res.status(200).json({
                success: true,
                completedTasks,
            })
        }
        catch(error){
            console.error("error while fetching completed tasks", error);
            return res.status(500).json({ success: false, message: "Internal server error"});

        }
    }

    export const getPendingTasks = async (req, res) => {
          console.log("getPendingTask controller hit");
          try{
             const pendintasks = await taskModel.countDocuments({ status: "Pending"});
              if(pendintasks === 0){
                 return res.status(404).json({
                    success: false,
                    message: "No pending tasks found"
                 })
              }
              return res.status(200).json({
                 success: true,
                 pendintasks: pendintasks,
              })
          }catch(error){
            console.error("error while fetching pending tasks", error);
            return res.status(500).json({ success:false, message: "Internal server error"});

          }

    }

    export const getInProgressTasks = async (req, res) => {
         console.log("getInPrgressTasks controller hit"); 
         try{
             const inprogress = await taskModel.countDocuments({ status: "In Progress"});
             if(inprogress === 0){
                 return res.status(404).json({
                      success:false,
                      message: "No In Progress tasks found",
                 })
             }
             return res.status(200).json({
                success: true,
                inprogress: inprogress,
             })
         }catch(error){
              console.error("error while fetching In Progress tasks", error);
              return res.status(500).json({ success: false, message: "internal server error"});
         }
    }
   

 export const getUserPendingTasks = async (req, res) => {
      console.log("getUserPendingTasks controller hit");
      console.log("req.user:", req.user);
  
    try {
       const userId = req.user.id;  
       const pendingCount = await taskModel.countDocuments({
      assign: userId,
      status: 'Pending'
    });

    res.status(200).json({ pendingTasks: pendingCount });
  } catch (error) {
    console.error('Error fetching pending tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

  export const getUserInProgressTasks = async (req, res) => {
      console.log("getUserPendingTasks controller hit");
      console.log("req.user:", req.user);
  
    try {
       const userId = req.user.id;  
       const inProgressCount = await taskModel.countDocuments({
      assign: userId,
      status: 'In Progress'
    });

    res.status(200).json({ inProgressTasks: inProgressCount });
  } catch (error) {
    console.error('Error fetching pending tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
  }

  export const getUserCompletedTasks = async (req, res) => {
      console.log("getUserPendingTasks controller hit")
      console.log("req.user:", req.user)

      try{
         const userId = req.user.id;
         const completedTasks = await taskModel.countDocuments({
            status: 'Completed',
            assign:userId,
         })
         return res.status(200).json({
             success: true,
             completedTasks: completedTasks,
         })
      }
      catch(error){
            console.log("Error while fetching completed tasks", error)
            return res.status(500).json({
               success: false, 
               message: "Internal server error"
            })
         }
  }


export default {
      getCompletedTask,
      getPendingTasks,
      getInProgressTasks,
      getUserPendingTasks,
      getUserInProgressTasks,
      getUserCompletedTasks,

}
