import { User } from "../../entities/User";
import { UserCreateDTO } from "./dtos/user-create.dto";
import { Errors, Pagination } from "../../helpers/error";
import { UserUpdateDto } from "./dtos/user-update.dto";
import { UserLoginDTO } from "./dtos/user-login.dto";
import { AuthService } from "../auths/auth-service";
import { redis } from "../redis/redis-service";

const crypto = require('crypto');
const authService = new AuthService
export class UserService {
    async createUser(userData: UserCreateDTO) {
        return await User.createUser(userData)
    }

    //get user detailuserId
    async getUserDetail(userId: number) {
        const userDetail = await User.getDetail(userId);
        if (!userDetail) {
            throw Errors.UserNotFound
        }
        return userDetail;

    }

    //Get list users    
    async getListUser(pagination: Pagination) {
        return await User.getListUser(pagination);
    }

    // Update User By Id
    async updateUserById(userUpdateData: UserUpdateDto) {
        return await User.updateUser(userUpdateData);
    }

    //Delete user by id
    async deleteUserById(userId: number): Promise<void> {
        return await User.deleteUserById(userId);
    }

    //Login user
    async loginUser(userLoginData: UserLoginDTO) {
        return await User.getUserLoginId(userLoginData)
    }

    //Token
    async setToken(user: User, userAgent: string) {
        const userId = user.UserId;
        const payload = { userId };
        const deviceId = crypto.createHash('sha256').update(userAgent).digest('hex');
        const token = await authService.generateToken(payload, process.env.accessTokenExpire, process.env.refreshTokenExpire)
        authService.storeToken(userId, token.accessToken, process.env.accessTokenExpire, token.refreshToken, process.env.refreshTokenExpire, deviceId);
        return token;
    }

    //Logout
    async logOutOne(userId) {
        const acKeys = await redis.keys(`access_token:${userId}*`);
        const refKeys = await redis.keys(`refresh_token:${userId}*`);
        const allKeys = acKeys.concat(refKeys)
        if (allKeys.length > 0) {
            await redis.del(...allKeys);
        }
    }

    async logOutAll(accessTokenKey, refreshTokenKey) {
        if (!accessTokenKey || !refreshTokenKey) {
            throw Errors.BadRequest;
        }
        await redis.del(accessTokenKey, refreshTokenKey)


    }




}

