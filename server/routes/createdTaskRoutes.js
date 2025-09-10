import { resourceUsage } from "process";
import {
    createTaskTitle,
    getTaskTitle,
} from "../controller/addTaskContoller.js";
import express from "express"

const router = express.Router();

router.post("/tasktitle", createTaskTitle);
router.get("/getTask", getTaskTitle);


export default router
