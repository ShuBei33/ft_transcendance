import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { HttpService } from "src/http/http.service";
@Module({
  imports: [HttpModule],
  providers: [HttpService],
  exports: [HttpService],
})
export class UserIdentification {}
