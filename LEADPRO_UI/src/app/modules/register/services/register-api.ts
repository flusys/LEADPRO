import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IResponsePayload } from "@flusys/flusysng/shared/interfaces";
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterApi {
  baseUrl=environment.apiBaseUrl+'/auth'
  http = inject(HttpClient);
  constructor() {
  }
  registration(body: FormData,folderName?:string) {
    return this.http.post<IResponsePayload<number>>(this.baseUrl + `/registration?folderPath=${folderName}`, body);
  }
}
