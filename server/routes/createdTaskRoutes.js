import { resourceUsage } from "process";
import {
    createTaskTitle,
    getTaskTitle,
    getTotaltask,
} from "../controller/addTaskContoller.js";
import express from "express"

const router = express.Router();

router.post("/tasktitle", createTaskTitle);
router.get("/getTask", getTaskTitle);
router.get("/gettotaltask", getTotaltask)


export default router
