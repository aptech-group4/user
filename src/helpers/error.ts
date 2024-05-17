import { Response, Request, NextFunction } from "express";



export class SuccessResponse { // đây là formar của bất kì response nào dù thực thi đúng hay gây ra lỗi
    data: any  // vì data có thể là true hoặc bất kì kiểu dữ liệu nào nên đặt any
    error: ErrorResponse
    pagination: Pagination

    constructor(data: any, error: ErrorResponse, pagination: Pagination) {
        this.data = data
        this.error = error
        this.pagination = pagination
    }
}

//handle error
export function errorHandler(err: ErrorResponse, req: Request, res: Response) {
    return res.send(
        new SuccessResponse(null, err, null)
    );
}



export class ErrorResponse {
    status: number
    code: string
    message: string

    constructor(message: string, status: number, code: string) {
        this.status = status
        this.code = code
        this.message = message
    }
}
export const Errors = {
    BadRequest: new ErrorResponse('Bad Request', 400, "error.badRequest"),
    UserNotFound: new ErrorResponse('User Not Found', 404, "error.userNotFound"),
    Unauthorized: new ErrorResponse('Unauthorized Token', 401, "error.unauthorized")
    

}   


export class Pagination {
    page: number;
    limit: number;
    total?: number;

    constructor(page: number, limit: number, total: number = 0) {
        this.page = page;
        this.limit = limit;
        this.total = total;
    }

    static fromReq(req: Request): Pagination {
        const page = Number(req.query.page)
        const limit = Number(req.query.limit)
        return new Pagination(isNaN(page) ? 1 : page, isNaN(limit) ? 10 : limit);
    }

    getOffset(pagination: Pagination) {
        const { page, limit } = pagination
        return (page - 1) * limit
    }
}

export function getErrors(errors, next: NextFunction) {
    errors.forEach(error => {
        const constraints = error.constraints;
        if (constraints) {
            for (const constraintType in constraints) {
                if (constraints.hasOwnProperty(constraintType)) {
                    const errorMessage = constraints[constraintType];
                    const newError = new ErrorResponse(errorMessage, Errors.BadRequest.status, Errors.BadRequest.code);
                    return next(newError);
                }
            }
        }
    })
}






