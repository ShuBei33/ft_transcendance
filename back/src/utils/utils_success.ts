import { Response } from 'express';
export const successTemplate = <T>(
  res: Response,
  status: number,
  message: string,
  data?: T,
) => {
  const jsonResponse = {
    success: true,
    message,
  };

  if (data) {
    jsonResponse['data'] = data;
  }

  return res.status(status).json(jsonResponse);
};

export namespace success {
  export const general = <T = {}>(res: Response, message: string, data?: T) =>
    successTemplate(res, 200, message, data);
}
