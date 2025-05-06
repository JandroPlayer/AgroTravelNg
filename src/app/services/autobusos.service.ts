import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Autobus {
  id: number;
  marca: string;
  model: string;
  anyFabricacio: number;
  autonomiaKm: number;
  capacitatPassatgers: number;
  numParadesAssignades: number;
  preuPerPersona: number;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class AutobusosService {
  private apiUrl = 'http://localhost:8080/api/vehicles/autobusos';

  constructor(private http: HttpClient) {}

  getAutobusos(): Observable<Autobus[]> {
    return this.http.get<Autobus[]>(this.apiUrl);
  }
}
