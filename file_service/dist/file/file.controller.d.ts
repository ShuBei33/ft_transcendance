/// <reference types="multer" />
import { HttpStatus } from "@nestjs/common";
import { HttpService } from "src/http/http.service";
export declare class FileController {
    private readonly httpService;
    constructor(httpService: HttpService);
    uploadFile(file: Express.Multer.File, req: Request): Promise<HttpStatus>;
    GetAvatar(req: Request, id: string, res: any): void;
}
