import { registerUser,
        loginUser,
        updateUser,
        deleteUser,
        logoutUser,     
        getUser,
        getAllUsers,
        getAllStaff,
        getUserProfile,
        getTotalStaff,

 } from "../controller/userController.js";
import upload from "../middleware/multer.js";
import express from 'express'
import requireAuth from "../middleware/Auth.js";

const Authrouter = express.Router();

Authrouter.post('/register', registerUser);
Authrouter.post("/login", loginUser);
Authrouter.put('/update/:id', requireAuth, upload.single('image'), updateUser);
Authrouter.delete('/delete/:id', requireAuth, deleteUser);
Authrouter.post('/logout', requireAuth, logoutUser);
Authrouter.get('/getuser/:id', requireAuth, getUser);
Authrouter.get('/getallusers', requireAuth, getAllUsers);
Authrouter.get('/getallstaff', requireAuth, getAllStaff);
Authrouter.get('/profile/:id', requireAuth, getUserProfile);
Authrouter.get('/totalstaff', requireAuth, getTotalStaff);

export default Authrouter;
