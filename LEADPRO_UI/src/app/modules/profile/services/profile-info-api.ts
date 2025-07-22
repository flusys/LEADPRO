import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IResponsePayload } from "@flusys/flusysng/shared/interfaces";
import { environment } from '../../../../environments/environment';
import { ProfileInfoData } from '../interfaces/profile-info-data.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileInfoApi {
  baseUrl = environment.apiBaseUrl + ''
  http = inject(HttpClient);
  constructor() {
  }

  getById(id: number) {
    return this.http.get<IResponsePayload<ProfileInfoData>>(this.baseUrl + `/profile/${id}`);
  }

  updateProfile(data: FormData, id: number, folderName?: string) {
    return this.http.put<IResponsePayload<ProfileInfoData>>(this.baseUrl + `/profile/${id}?folderPath=${folderName}`, data);
  }
}
