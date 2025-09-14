import taskModel from "../models/taskModel.js";
import cloudinary from "../config/cloudinary.js"

export const createTask = async (req, res ) => {
     try{
         const { title, description, assign, createdBy } = req.body;
         const newTask = new taskModel({
             title,
             description,
             assign,
             createdBy,
         })
         await newTask.save();
         return res.status(200).json({
             success: true,
             message: "Task created successfully",
             task:{ 
                    id: newTask._id,
                    title: newTask.title,
                    description: newTask.description,
                    assign: newTask.assign,
                    status: newTask.status,
                    createdBy: newTask.createdBy,
             }
         })
     } catch(error){
         console.error("Error while creating task", error);
        return res.status(500).json({ success: false, message: 'Internal server error'});
     }
}

    export const getAllAssignedTasks = async (req, res) => {
    try {
        const tasks = await taskModel.find({})
            .populate('assign', 'firstName lastName email role image')
            .select('title description assign status proofUrl');
        return res.status(200).json({
            success: true,
            tasks
        });
    } catch (error) {
        console.error("Error while fetching all assigned tasks", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { taskId, status } = req.body;
        const updatedTask = await taskModel.findByIdAndUpdate(
            taskId,
            { status },
            { new: true }
        ).populate('assign', 'firstName lastName email role image');

        if (!updatedTask) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Task status updated successfully",
            task: {
                id: updatedTask._id,
                title: updatedTask.title,
                description: updatedTask.description,
                assign: updatedTask.assign,
                status: updatedTask.status
            }
        });
    } catch (error) {
        console.error("Error while updating task status", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
export const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const deletedTask = await taskModel.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
            task: {
                id: deletedTask._id,
                title: deletedTask.title,
                description: deletedTask.description,
                assign: deletedTask.assign,
                status: deletedTask.status
            }
        });
    } catch (error) {
        console.error("Error while deleting task", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const getUserAssignTask = async (req, res) => {
    try {
        const userId = req.params.id;
        const createdBy = req.query.createdBy;
        
        const query =  {assign: userId};
        if(createdBy){
            query.createdBy = createdBy;
        }
       const tasks = await taskModel.find(query)
        .populate('assign', 'firstName lastName email role image')
         .populate('createdBy', 'firstName lastName email')
        .select('title description assign status createdBy');

        return res.status(200).json({
            success: true,
            tasks
        });
    } catch (error) {
        console.error("Error while fetching assigned tasks", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

    export const updatedTask = async (req, res) => {
        try{
            const taskId = req.params.id;
            const {title, description, assign } = req.body;
            const updatedTask = await taskModel.findByIdAndUpdate(taskId, {
                 title,
                 description,
                 assign,
            }
            , { new: true }
            ).populate('assign', 'firstName lastName email role image');
            if(!updatedTask){
                return res.status(404).json({ success: false, message: "Task not found"});
            }
            return res.status(200).json({
                success: true,
                message: "Task updated successfully",
                task:{
                    id: updatedTask._id,
                    title:updatedTask.title,
                    description:updatedTask.description,
                    assign: updatedTask.assign,
                }
            })
        }catch(error){
            console.log("Error while updating task", error);
            return res.status(500).json({ success: false, message: "Internal server error"});
        }
    }
    export const getTotalTask = async (req, res) => {
         try{
            const totalTask = await taskModel.countDocuments();
            if(!totalTask){
                return res.status(404).json({ success: false, message: "No tasks found"});
            }
            return res.status(200).json({
                success:true,
                totalTask,
            })
         }catch(error){
            console.error("error while fetching total task", error);
            return res.status(500).json({ success: false, message: "Internal server error"});
         }
    }
   
  export const updateProofUrl = async (req, res) => {
  try {
    const { id } = req.params;
    let proofUrl = null;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "task_proof" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer); 
      });

      proofUrl = result.secure_url;
    }

    const updatedTask = await taskModel.findByIdAndUpdate(
      id,
      { proofUrl },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error while updating proof image:", error);
    res.status(500).json({ message: "Failed to update proof image" });
  }
};

 

export default{
  createTask,
  getAllAssignedTasks,
  updateStatus,
  deleteTask,
  getUserAssignTask,
  updatedTask,
  getTotalTask,
  updateProofUrl,
};