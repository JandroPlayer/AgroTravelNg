import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {environment} from './environments/enviroment.prod';

export interface Activitat {
  id: number;
  nom: string;
  tipus: string;
  descripcio: string;
  lat_activitat: number;
  lng_activitat: number;
  distance: number;
}

@Injectable({
  providedIn: 'root'
})
export class ActivitatsService {
  private apiUrl = `${environment.apiUrl}/activitats`; // URL base

  constructor(private http: HttpClient) {}

  getActivitatsByLocation(lat: number, lng: number, radius: number): Observable<Activitat[]> {
    const params = new HttpParams()
      .set('lat', lat)
      .set('lng', lng)
      .set('radius', radius);

    return this.http.get<Activitat[]>(`${this.apiUrl}/per-hotel`, { params }).pipe(
      tap(activitats => console.log('Activitats recibidas:', activitats)) // Verifica los datos recibidos
    );
  }
}
