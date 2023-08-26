import { HttpService as _HttpService } from "@nestjs/axios";
export interface User {
    id: number;
    login: string;
    pseudo: string;
    avatar?: string | null;
    rank: number;
}
export declare class HttpService {
    private readonly http;
    constructor(http: _HttpService);
    checkJWT(token: string): Promise<any>;
}
