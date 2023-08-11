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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const common_3 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const common_4 = require("@nestjs/common");
const multer_1 = require("multer");
const common_5 = require("@nestjs/common");
const common_6 = require("@nestjs/common");
var path = require('path');
const config = {
    supportedImageExtentions: ['.jpg', '.jpeg', '.png', '.gif'],
    supportedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
    oneKB: 1024,
    maxSizeMB: 6,
    avatarStoragePath: './src/storage/avatar',
};
const logger = new common_5.Logger();
const avatarUploadOptions = {
    storage: (0, multer_1.diskStorage)({
        destination: config.avatarStoragePath,
        filename: (req, file, cb) => {
            logger.log('body here', req.body);
            const userId = req.body['userId'];
            const extension = path.parse(file.originalname).ext;
            cb(null, `${userId}${extension}`);
        },
    }),
};
let FileController = exports.FileController = class FileController {
    uploadFile(file, req) {
        logger.log('ok');
        logger.log(req.body);
    }
};
__decorate([
    (0, common_2.Post)('upload'),
    (0, common_3.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', avatarUploadOptions)),
    __param(0, (0, common_4.UploadedFile)(new common_6.ParseFilePipe({
        validators: [
            new common_1.FileTypeValidator({ fileType: /.(jpg|jpeg|png|gif)$/ }),
            new common_1.MaxFileSizeValidator({
                maxSize: config.maxSizeMB * config.oneKB * config.oneKB,
            }),
        ],
    }))),
    __param(1, (0, common_2.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof Express !== "undefined" && (_a = Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object, typeof (_c = typeof Request !== "undefined" && Request) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "uploadFile", null);
exports.FileController = FileController = __decorate([
    (0, common_1.Controller)('avatar')
], FileController);
//# sourceMappingURL=file.controller.js.map