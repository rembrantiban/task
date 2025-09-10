import mongoose from "mongoose";

const addTaskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
    },
}, { timeStamp: true } )


const addTaskModel = mongoose.model("AddTask" , addTaskSchema)

export default addTaskModel;