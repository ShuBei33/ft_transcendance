import { Injectable } from "@nestjs/common";
import { HttpService as _HttpService } from "@nestjs/axios";
import { Observable } from "rxjs";
import { AxiosResponse, AxiosError } from "axios";
import { firstValueFrom, catchError } from "rxjs";

export interface User {
  id: number;
  login: string;
  pseudo: string;
  avatar?: string | null;
  rank: number;
}

// const response = await firstValueFrom(
//   this.httpService.checkJWT(BearerHeader.split(" ")[1]).pipe(
//     catchError((e: AxiosError) => {
//       throw e;
//     })
//   )
// );

@Injectable()
export class HttpService {
  constructor(private readonly http: _HttpService) {}

  public async checkJWT(token: string): Promise<any> {
    const response = await firstValueFrom(
      this.http
        .get("http://back:5500/auth/checkJWT", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .pipe(
          catchError((e: AxiosError) => {
            throw e;
          })
        )
    );
    return response;
  }
}
