
import { Errors, SuccessResponse, getErrors } from "../../helpers/error";
import { NextFunction, Request, Response } from "express";
const jwt = require('jsonwebtoken');
import { AuthService } from "./auth-service";
import bearerToken from "express-bearer-token";
import { Helpers } from "../../helpers";
import { redis } from "../redis/redis-service";



export const extractToken = bearerToken();
const authService = new AuthService()
const helper = new Helpers()
const crypto = require('crypto');



export class AuthMiddleware {
    async authenticateToken(req: Request, res: Response, next: NextFunction) {

        const userAgent = req.headers['user-agent'];
        const deviceId = crypto.createHash('sha256').update(userAgent).digest('hex');
        console.log(deviceId);
        const reqToken = req.headers.authorization?.split(' ')[1];  
        console.log(reqToken)
        if (!reqToken) {
            return next(Errors.Unauthorized);
        }
        try {
            const tokenData = await authService.checkToken(reqToken, deviceId)
            console.log(tokenData)
            const redisToken = await redis.get(tokenData.accessTokenKey);

            if (redisToken && tokenData.tokenType == 'access') {
                const cleanAccessRedisToken = redisToken.substring(3);
                await jwt.verify(cleanAccessRedisToken, process.env.SECRET_KEY);
                console.log(tokenData)
                req.body = {
                    userId: tokenData.userId,
                    accessTokenKey: tokenData.accessTokenKey,
                    refreshTokenKey: tokenData.refreshTokenKey
                }

                return next();

            } else {
                const redisRefreshToken = await redis.get(tokenData.refreshTokenKey);

                const cleanRefreshRedisToken = redisRefreshToken.substring(3);
                const decodedRf = jwt.verify(cleanRefreshRedisToken, process.env.REFRESH_SECRET_KEY)
                const timeElapsed = Math.floor(Date.now() / 1000) - decodedRf.iat
                const newRefreshTokenEx = await helper.convertTimeToString(helper.getSeconds(process.env.refreshTokenExpire) - timeElapsed)
                await redis.del(tokenData.accessTokenKey);
                await redis.del(tokenData.refreshTokenKey);

                const newToken = await authService.generateToken({ userId: tokenData.userId }, process.env.accessTokenExpire, newRefreshTokenEx)
                const newAccessToken = newToken.accessToken
                const newRefreshToken = newToken.refreshToken
                authService.storeToken(tokenData.userId, newToken.accessToken, process.env.accessTokenExpire, newToken.refreshToken, newRefreshTokenEx, deviceId)
                res.send(
                    new SuccessResponse({
                        newAccessToken,
                        newRefreshToken
                    }, null, null)
                )
            }
        }
        catch (error) {
            next(error)
        }
    }
}