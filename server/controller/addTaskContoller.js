import addTaskModel from "../models/addTaskModel.js";

export const createTaskTitle = async (req, res) => {
    try{
        const { task } = req.body
        const Task = new addTaskModel({
          task
        })

        await Task.save()
        return res.status(200).json({ success: true, task: Task })
    }
    catch(error){
         console.log("Error while creating Task", error)
         return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}
export const getTaskTitle = async (req, res) => {
     try{
        const tasks = await addTaskModel.find().sort({ createdAt: -1 })
        return res.status(200).json({ success: true, tasks })
     }
     catch(error){
        console.error("Error while Fetching Task data", error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
     }
}

export default {
    createTaskTitle,
    getTaskTitle,
}
