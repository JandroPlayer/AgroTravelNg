import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from './environments/environment';

interface ReservaService {
  pagarReserva(id: number): Observable<any>;
  deleteReserva(id: number): Observable<any>;
}

export interface ReservaAutobus {
  pagada: boolean;
  cancelant: boolean;
  id: string;
  autobus: { id: number };      // Referencia al autobús
  fechaReserva: Date;           // Fecha y hora combinadas
  numPassatgers: number;        // Número de pasajeros
  user: { id: number };         // Usuario que hace la reserva
}

@Injectable({
  providedIn: 'root'
})
export class ReservaAutobusService implements ReservaService {
  private apiUrl = `${environment.apiUrl}/reservas-autobus`;

  constructor(private http: HttpClient) {}

  // Crear una nueva reserva de autobús
  createReserva(reserva: {
    autobusId: number;
    numPassatgers: any;
    fechaReserva: string;
    userId: any;
    preu: number
  }): Observable<ReservaAutobus> {
    const body = {
      autobus: { id: reserva.autobusId },
      user: { id: reserva.userId },
      dataHora: reserva.fechaReserva,
      num_passatgers: reserva.numPassatgers,
      preu: reserva.preu
    };

    return this.http.post<ReservaAutobus>(this.apiUrl, body);
  }


  // Obtener todas las reservas
  getReservasAutobus(): Observable<ReservaAutobus[]> {
    return this.http.get<ReservaAutobus[]>(this.apiUrl);
  }

  // Obtener reservas por autobús
  getReservasByAutobus(autobusId: number): Observable<ReservaAutobus[]> {
    return this.http.get<ReservaAutobus[]>(`${this.apiUrl}/autobus/${autobusId}`);
  }

  // Obtener reservas por usuario
  getReservasAutobusByUser(userId: string): Observable<ReservaAutobus[]> {
    return this.http.get<ReservaAutobus[]>(`${this.apiUrl}/user/${userId}`);
  }

  updateReservaAutobus(id: number, reserva: ReservaAutobus): Observable<ReservaAutobus> {
    return this.http.put<ReservaAutobus>(`${this.apiUrl}/${id}`, reserva);
  }

  // reserva.service.ts
  pagarReserva(reservaId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${reservaId}/pagar`, {});
  }

  deleteReserva(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
