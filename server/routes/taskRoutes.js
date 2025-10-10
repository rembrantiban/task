import express from 'express';
import {
  createTask,
  getAllAssignedTasks,
  updateStatus,
  deleteTask,
  getUserAssignTask,
  updatedTask,
  getTotalTask,
  updateProofUrl,
  addCommentToTask,
  getUserWeeklyCompletedTasks,
} from '../controller/taskController.js';
import {
       getCompletedTask,
       getPendingTasks,
       getInProgressTasks,
       getUserPendingTasks,
       getUserInProgressTasks,
       getUserCompletedTasks,
}
from '../controller/taskCardController.js';
import requireAuth from '../middleware/Auth.js';
import upload from '../middleware/multer.js';


const taskRouter = express.Router();

taskRouter.get('/test', (req, res) => {
  res.json({ message: "Task route test works!" });
});

taskRouter.post('/create', createTask);
taskRouter.get('/getallassignedtasks', getAllAssignedTasks);
taskRouter.put('/updatestatus', updateStatus);
taskRouter.delete('/delete/:id', deleteTask);
taskRouter.get('/getuserassign/:id', getUserAssignTask);
taskRouter.put('/updatetask/:id', updatedTask);
taskRouter.get('/totaltask', getTotalTask);
taskRouter.get('/completedtasks', requireAuth, getCompletedTask);
taskRouter.get('/pendingtasks', getPendingTasks);
taskRouter.get("/inprogress",  getInProgressTasks)
taskRouter.get('/userpendingtasks', requireAuth , getUserPendingTasks);
taskRouter.get('/userinprogress', requireAuth, getUserInProgressTasks);
taskRouter.get('/usercompletedtasks', requireAuth, getUserCompletedTasks);
taskRouter.put("/updateproofimage/:id", upload.single("proofImage"), updateProofUrl);
taskRouter.put("/addcomment/:taskId", requireAuth, addCommentToTask);
taskRouter.get("/userweeklycompletedtasks", requireAuth, getUserWeeklyCompletedTasks);

export default taskRouter;
