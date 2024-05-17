import { plainToClass } from "class-transformer";
import { UserCreateDTO } from "./dtos/user-create.dto";
import { validateOrReject } from "class-validator";
import { getErrors } from "../../helpers/error";
import { NextFunction, Request, Response } from "express";
const jwt = require('jsonwebtoken');



export class UserMiddleware {
    async validateUserData(req: Request, res: Response, next: NextFunction) {
        const userData = plainToClass(UserCreateDTO, req.body);
        try {
            await validateOrReject(userData);
            next();
        } catch (errors) {
            getErrors(errors, next)
        }
    }
}   