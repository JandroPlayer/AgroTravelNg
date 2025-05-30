// cloudinary.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from './environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  private backendUrl = `${environment.apiUrl}/cloudinary-signature`; // Ajusta si estás en producción

  constructor(private http: HttpClient) {}

  getCloudinarySignature() {
    return this.http.get<any>(this.backendUrl);
  }
}
