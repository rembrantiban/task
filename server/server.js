import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import cors from 'cors';
import connectDb from './config/ConnectDb.js';  
import Authrouter from './routes/userRoutes.js';  
import taskRouter from './routes/taskRoutes.js';
import router  from './routes/createdTaskRoutes.js';

const app = express();
const Port = process.env.PORT || 5000;

 console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded' : 'Missing');

connectDb();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
    allowedHeaders: ['Authorization', 'Content-Type'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
  
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use('/api/user', Authrouter);
app.use('/api/task', taskRouter);
app.use("/api/title", router)
console.log('Task router mounted at /api/task');

app.get('/', (req, res) => res.send("App is working"));

app.listen(Port, () => {
  console.log(`App is running on http://localhost:${Port}`);
});
