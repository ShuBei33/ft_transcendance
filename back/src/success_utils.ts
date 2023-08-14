import { Response } from 'express';
export const successTemplate = (res: Response, status: number, message: string) =>
    res.status(200).json({
        success: true,
        message,
    });

export namespace success {
    export const general = (res: Response, message: string) => successTemplate(res, 200, message);
}