import { NextFunction, Request, Response } from "express";
import { UserCreateDTO } from "./dtos/user-create.dto";
import { UserService } from "./user.service";
import { Errors, Pagination, SuccessResponse } from "../../helpers/error";
import { UserUpdateDto } from "./dtos/user-update.dto";
import { EmailQueue } from "../emails/email-queue";
import { plainToClass } from "class-transformer";
import { UserLoginDTO } from "./dtos/user-login.dto";
import { AuthService } from "../auths/auth-service";
require('dotenv').config()
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


export class UserController {
    private emailQueue: EmailQueue;
    public userService: UserService;
    public authService: AuthService;

    constructor(emailQueue: EmailQueue, userService: UserService, authService: AuthService) {
        this.emailQueue = emailQueue;
        this.userService = userService
        this.authService = authService
        this.createUser = this.createUser.bind(this);
        this.getListUsers = this.getListUsers.bind(this);
        this.updateUserById = this.updateUserById.bind(this);
        this.deleteUserById = this.deleteUserById.bind(this);
        this.userLogin = this.userLogin.bind(this)
    }
    //create user
    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userData: UserCreateDTO = req.body;
            await this.userService.createUser(userData);
            await this.emailQueue.addEmailJob(userData.Email, 'Chào người anh em thiện lành', `Hello ${userData.FullName}`);
            res.send(
                new SuccessResponse(true, null, null)
            )
        } catch (error) {
            next(error);
        }
    }

    //get user detail 
    async getUserDetail(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = parseInt(req.params.userId);
            const userDetail = await this.userService.getUserDetail(userId);
            return res.send(
                new SuccessResponse(userDetail, null, null)
            )
        } catch (error) {
            next(error)
        }
    }

    //get list user 
    async getListUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const { listUsers, pagination } = await this.userService.getListUser(Pagination.fromReq(req));
            res.send(
                new SuccessResponse(listUsers, null, pagination)
            )
        } catch (error) {
            next(error);
        }
    }

    //update user by id
    async updateUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const userData: UserUpdateDto = req.body;
            userData.UserId = parseInt(req.params.userId);
            const updatedUser = await this.userService.updateUserById(userData);
            return res.send(
                new SuccessResponse(updatedUser, null, null)
            );
        } catch (error) {
            next(error);
        }
    }

    // delete user by ids
    async deleteUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const userId: number = parseInt(req.params.userId);
            await this.userService.deleteUserById(userId);
            return res.send(
                new SuccessResponse(true, null, null)
            );
        } catch (error) {
            next(error);
        }
    }
    //protected contents
    async protectedRoute(req: Request, res: Response) {
        res.send('Protected content accessed by ');
    };

    //user login
    async userLogin(req: Request, res: Response, next: NextFunction) {
        try {
            const userData = plainToClass(UserLoginDTO, req.body);
            const userAgent = req.headers['user-agent'];
            const user = await this.userService.loginUser(userData);
            const result = await this.userService.setToken(user, userAgent)

            return res.send(
                new SuccessResponse({
                    ...user, ...result
                }, null, null)
            )
        } catch (error) {
            next(error)
        }
    }

    //user logout
    async userLogout(req: Request, res: Response, next: NextFunction) {
        let isActive: boolean = true;
        if (!isActive == true) {
            try {
                await this.userService.logOutOne(req.body.userId)
                res.send(
                    new SuccessResponse(true, null, null)
                )
            } catch (error) {
                next(error)
            }
        } else {
            try {
                await this.userService.logOutAll(req.body.accessTokenKey, req.body.refreshTokenKey)
                res.send(
                    new SuccessResponse(true, null, null)
                )
            } catch (error) {
                res.send(
                    Errors.Unauthorized
                );
            }
        }

    }




}