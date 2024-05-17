import { User } from "../../entities/User";
import { UserLoginDTO } from "../users/dtos/user-login.dto";
import { Helpers } from "../../helpers";
import { redis } from "../redis/redis-service";

const jwt = require('jsonwebtoken');
const crypto = require('crypto');   
const helper = new Helpers()

export class AuthService {
    async checkToken(reqToken: string, deviceId: string) {
        const tokenType = reqToken.startsWith('ac_') ? 'access' : 'refresh';
        const cleanedToken = reqToken.substring(3);
        const secretKey = tokenType == 'access' ? process.env.SECRET_KEY : process.env.REFRESH_SECRET_KEY
        const decoded = jwt.verify(cleanedToken, secretKey);
        const userId = decoded.userId;
        const accessTokenKey = `access_token:${userId}:${deviceId}`;
        const refreshTokenKey = `refresh_token:${userId}:${deviceId}`;

        return {
            userId,
            tokenType,
            accessTokenKey,
            refreshTokenKey
        }

    }
    async generateToken(payload: Object, S_expiresIn: string, R_expiresIn: string) {

        const accessToken = 'ac_' + jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: S_expiresIn });
        const refreshToken = 'rf_' + jwt.sign(payload, process.env.REFRESH_SECRET_KEY, { expiresIn: R_expiresIn });
        return { accessToken, refreshToken };
    }

    async storeToken(userId: number, accessToken: string, accessTokenEx: string, refreshToken: string, refreshTokenEx: string, deviceId: string) {
        const accessTokenKey = `access_token:${userId}:${deviceId}`;
        const refreshTokenKey = `refresh_token:${userId}:${deviceId}`;

        const accessTokenTTL = helper.getSeconds(accessTokenEx);
        const refreshTokenTTL = helper.getSeconds(refreshTokenEx);

        // hàm redis này cần viết vào redis service
        await redis.setex(accessTokenKey, accessTokenTTL, accessToken);
        await redis.setex(refreshTokenKey, refreshTokenTTL, refreshToken);
    }
}