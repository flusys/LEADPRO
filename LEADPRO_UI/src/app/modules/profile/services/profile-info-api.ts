import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IResponsePayload } from "@flusys/flusysng/shared/interfaces";
import { environment } from '../../../../environments/environment';
import { ProfileInfoData } from '../interfaces/profile-info-data.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileInfoApi {
  baseUrl = environment.apiBaseUrl + '/auth'
  http = inject(HttpClient);
  constructor() {
  }

  getById(id: number) {
    return this.http.get<IResponsePayload<ProfileInfoData>>(this.baseUrl + `/profile/${id}`);
  }
}
