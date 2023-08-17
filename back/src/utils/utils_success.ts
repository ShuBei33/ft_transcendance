import { Response } from 'express';
export const successTemplate = <T>(res: Response, status: number, message: string, data?: T) =>
    res.status(status).json(data && {
        success: true,
        message,
        data
    } || {
        success: true,
        message,
    });

export namespace success {
    export const general = <T = {}>(res: Response, message: string, data?: T) => successTemplate(res, 200, message, data);
}