/*
**	Le module article sera modifie, comme j'ai suivit un tuto je me suis entrainer a remplir la base de donnee au lancement du serveur
	j'imagine qu'on aura besoin de cette manip pour enrengistrer les positions de la balle sur la map par defaut / ou bien certaine page web 
	plus tard quand on voudra 
*/


import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService],
  imports: [PrismaModule],
})
export class ArticlesModule {}
