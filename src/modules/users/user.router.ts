import express from 'express';
import { UserController } from './user.controller';
import { UserMiddleware } from './user.middleware';
import { AuthMiddleware, extractToken } from '../auths/auth-middleware';
import { EmailQueue } from '../emails/email-queue';
import { UserService } from './user.service';
import { AuthService } from '../auths/auth-service';


export const userRouter = express.Router();
const emailQueue = new EmailQueue();
const userService = new UserService();
const authService = new AuthService()
const userController = new UserController(emailQueue, userService, authService);
const userMiddleware = new UserMiddleware();
const authMiddleware = new AuthMiddleware()


//no use stored procedure
userRouter.post('/create', userMiddleware.validateUserData, userController.createUser); // create user route
userRouter.get('/list', userController.getListUsers); // get list users
userRouter.put('/update/:userId', userController.updateUserById); // update one user by id 
userRouter.delete('/delete/:userId', userController.deleteUserById); // delete 
userRouter.get('/detail/:userId', userController.getUserDetail.bind(userController)) // get user by id
userRouter.post('/login', userController.userLogin); // user login
userRouter.get('/protected', extractToken, authMiddleware.authenticateToken, userController.protectedRoute);
userRouter.post('/logout', authMiddleware.authenticateToken, userController.userLogout)
userRouter.use('/queues', emailQueue.bullBoardRouter)
