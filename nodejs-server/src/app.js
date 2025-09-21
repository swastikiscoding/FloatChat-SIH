import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { profileRouter } from './routes/profile.route.js';
import { chatRouter } from './routes/chat.route.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send('Welcome to FloatChat API');
});

app.use("/api/profiles", profileRouter);
app.use("/api/chat", chatRouter);

export {app};