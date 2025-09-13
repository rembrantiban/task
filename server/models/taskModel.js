import mongoose from "mongoose";


const taskSchema = new mongoose.Schema({
     title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required:true,
    },
    status: {   
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending',
        required: true,
    },
    proofUrl:{
        type:String,
    },
    assign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    }
}, {
    timestamps: true ,
});

 const taskModel = mongoose.model('Task', taskSchema);

    export default taskModel;

