import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VehicleElectric {
  id: number;
  marca: string;
  model: string;
  anyFabricacio: number;
  autonomiaKm: number;
  imageUrl: string;
}

export interface Autobus extends VehicleElectric {
  capacitatPassatgers: number;
  preuPerPersona: number;
}

export interface Taxi extends VehicleElectric {
  numLlicencia: string;
  tarifaBase: number;
  costPerKm: number;
}

@Injectable({
  providedIn: 'root'
})
export class VehiclesElectricsService {
  private baseUrl = 'http://localhost:8080/api/vehicles';

  constructor(private http: HttpClient) {}

  // Obtenir tots els vehicles elèctrics
  getAllVehicles(): Observable<VehicleElectric[]> {
    return this.http.get<VehicleElectric[]>(`${this.baseUrl}`);
  }

  // Obtenir un vehicle per ID
  getVehicleById(id: number): Observable<VehicleElectric> {
    return this.http.get<VehicleElectric>(`${this.baseUrl}/${id}`);
  }

  // Crear un nou vehicle
  createVehicle(vehicle: VehicleElectric): Observable<VehicleElectric> {
    return this.http.post<VehicleElectric>(`${this.baseUrl}`, vehicle);
  }

  // Eliminar un vehicle
  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Obtenir només autobusos
  getAutobusos(): Observable<Autobus[]> {
    return this.http.get<Autobus[]>(`${this.baseUrl}/autobusos`);
  }

  // Obtenir només taxis
  getTaxis(): Observable<Taxi[]> {
    return this.http.get<Taxi[]>(`${this.baseUrl}/taxis`);
  }
}
