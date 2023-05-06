/*
**			Module principal de l'application
*/

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';


@Module({ 			/* Decorateur : Fonction qui rajoute des metadata a la classe en dessous.
					** Chaque module peut importer des provideurs ou des controlleurs (on verra ca plus tard), ou d'autre module
					*/
  imports: [AuthModule, UserModule], /* On peut importer notre module d'authenfication*/
})

/*
** 			A noter qu'on aura plusieurs modules pour les differents services que l'on va mettre en place sur le site.
**			en passant par l'utilisateur ou encore la base de donnees, le chat etc.. les modules organise le site.
*/

export class AppModule {}

/*
**		Module de l'application, on ajoute export car sinon la classe n'est visible que dans le fichier
*/
