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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesService = void 0;
const common_1 = require("@nestjs/common");
const update_article_dto_1 = require("./dto/update-article.dto");
const prisma_service_1 = require("../prisma/prisma.service");
let ArticlesService = class ArticlesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createArticleDto) {
        return this.prisma.article.create({ data: createArticleDto });
    }
    findAll() {
        return this.prisma.article.findMany({ where: { published: true } });
    }
    findOne(id) {
        return this.prisma.article.findUnique({ where: { id } });
    }
    findDrafts() {
        return this.prisma.article.findMany({ where: { published: false } });
    }
    update(id, updateArticleDto) {
        return this.prisma.article.update({
            where: { id },
            data: update_article_dto_1.UpdateArticleDto,
        });
    }
    remove(id) {
        return this.prisma.article.delete({
            where: { id }
        });
    }
};
ArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ArticlesService);
exports.ArticlesService = ArticlesService;
//# sourceMappingURL=articles.service.js.map