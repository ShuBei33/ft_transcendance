import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { FileController } from "./file/file.controller";
import { UserIdentification } from "./http-module/http-module";
@Module({
  imports: [UserIdentification],
  controllers: [AppController, FileController],
  providers: [AppService],
})
export class AppModule {}
