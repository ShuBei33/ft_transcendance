"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateArticleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_article_dto_1 = require("./create-article.dto");
class UpdateArticleDto extends (0, swagger_1.PartialType)(create_article_dto_1.CreateArticleDto) {
}
exports.UpdateArticleDto = UpdateArticleDto;
//# sourceMappingURL=update-article.dto.js.map