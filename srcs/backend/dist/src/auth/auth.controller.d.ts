import { AuthService } from "./auth.service";
import { Request } from "express";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    findAll(): string;
    login(req: Request): string;
    signup(): string;
}
