import express, { urlencoded, json } from "express";
import { notFound } from "./lib/not-found";
import { error } from "./lib/error";

import cookieParser from 'cookie-parser';
import type { CorsOptions } from 'cors';
import cors from 'cors';

import notesRouter from "./routes/notesRoutes";
import authRoutes from './routes/authRoutes';
import usersRoutes from './routes/usersRoutes';
const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3000', 'https://yourdomain.com'],
    credentials: true  // Important for cookies
  }));
// Optional: Add security headers
app.use((req, res, next) => {
    res.header('X-Frame-Options', 'DENY');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-XSS-Protection', '1; mode=block');
    next();
  });

app.use("/api", notesRouter);
app.use('/api', authRoutes);
app.use('/api', usersRoutes);
app.use(notFound);
app.use(error);


export default app;