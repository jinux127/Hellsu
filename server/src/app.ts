import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { dbconnect } from './db/index';
import {
  userRouter,
  foodRouter,
  mealRouter,
  exerciseListRouter,
  routineRouter,
  postRouter,
} from './routers';
import cookieParser from 'cookie-parser';
import { loginRequired, upload, errorHandler } from './middlewares';

const app = express();
dbconnect();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/exerciseList', exerciseListRouter);
app.use('/api/food', foodRouter);
app.use('/api/meal', mealRouter);
app.use('/api/routine', routineRouter);
app.use('/api/post', postRouter);

// 테스트용 라우터
app.post(
  '/welcome',
  loginRequired,
  (req: Request, res: Response, next: NextFunction) => {
    res.send('welcome!');
  }
);

app.use(errorHandler);

export { app };