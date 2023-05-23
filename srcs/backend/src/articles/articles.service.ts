import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArticlesService {
	constructor(private prisma:PrismaService) {}
  create(createArticleDto: CreateArticleDto) {
    return this.prisma.article.create({data : createArticleDto});
  }

  findAll() {
    return this.prisma.article.findMany({where: {published:	true} });
  }

  findOne(id: number) {
    return this.prisma.article.findUnique({ where: { id } });
  }

  findDrafts() {
    return this.prisma.article.findMany({where: {published:	false} });
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
	return this.prisma.article.update({
		where: {id},
		data: UpdateArticleDto,
	});
  }

  remove(id: number) {
	return this.prisma.article.delete({
		where: {id}
	})
  }
}
