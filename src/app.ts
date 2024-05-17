import express, { NextFunction, Request, Response } from 'express';
const app = express();
import "reflect-metadata"
import { AppDataSource } from './data-source';
import { userRouter } from './modules/users/user.router';
import { ErrorResponse, errorHandler } from './helpers/error';
import { redis } from './modules/redis/redis-service';
const port = 8080;

const run = async () => {
  await AppDataSource.initialize()

  await redis.connect();
  app.use(express.json());
  app.use('/users', userRouter);

  app.use(
    (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
      errorHandler(err, req, res)
    }
  )

  app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
  });

}

run()