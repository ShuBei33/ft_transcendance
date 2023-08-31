"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileController = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const http_service_1 = require("../http/http.service");
const axios_1 = require("axios");
const path_1 = require("path");
var path = require("path");
const config = {
    oneKB: 1024,
    maxSizeMB: 6,
    avatarStoragePath: "./src/storage/avatar",
};
const logger = new common_1.Logger();
const avatarUploadOptions = {
    storage: (0, multer_1.diskStorage)({
        destination: config.avatarStoragePath,
        filename: (req, file, cb) => {
            const extension = path.parse(file.originalname).ext;
            logger.log(`user -- ${JSON.stringify(req["user"])}`);
            cb(null, `${req["user"].id}${extension}`);
        },
    }),
};
let UserInterceptor = class UserInterceptor {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async intercept(context, next) {
        const ctx = context.switchToHttp();
        const BearerHeader = ctx.getRequest().headers["authorization"];
        if (BearerHeader) {
            try {
                const user = await this.httpService
                    .checkJWT(BearerHeader.split(" ")[1])
                    .then((data) => data.data.user);
                ctx.getRequest()["user"] = user;
            }
            catch (e) {
                if (e instanceof axios_1.AxiosError && e.code == axios_1.AxiosError.ERR_BAD_REQUEST)
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.FORBIDDEN,
                        error: "Token invalid",
                    }, common_1.HttpStatus.FORBIDDEN);
                else
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                        error: "Unexpected error",
                    }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return next.handle();
    }
};
UserInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [http_service_1.HttpService])
], UserInterceptor);
let FileController = exports.FileController = class FileController {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async uploadFile(file, req) {
        return common_1.HttpStatus.CREATED;
    }
    GetAvatar(req, id, res) {
        const directoryPath = (0, path_1.join)(process.cwd(), "src", "storage", "avatar");
        (0, fs_1.readdir)(directoryPath, (err, files) => {
            if (err) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Unexpected error",
                }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            const fileToSend = files.find((file) => file.split(".").reverse().pop().toString() == id);
            if (fileToSend)
                res.sendFile((0, path_1.join)(directoryPath, fileToSend));
            else
                res.status(common_1.HttpStatus.OK).send(null);
        });
    }
};
__decorate([
    (0, common_1.Post)("upload"),
    (0, common_1.UseInterceptors)(UserInterceptor, (0, platform_express_1.FileInterceptor)("file", avatarUploadOptions)),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.FileTypeValidator({ fileType: /.(jpg|jpeg|png|gif)$/ }),
            new common_1.MaxFileSizeValidator({
                maxSize: config.maxSizeMB * config.oneKB * config.oneKB,
            }),
        ],
    }))),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Request]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.UseInterceptors)(UserInterceptor),
    (0, common_1.Get)("/download/:id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, String, Object]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "GetAvatar", null);
exports.FileController = FileController = __decorate([
    (0, common_1.Controller)("avatar"),
    __metadata("design:paramtypes", [http_service_1.HttpService])
], FileController);
//# sourceMappingURL=file.controller.js.map