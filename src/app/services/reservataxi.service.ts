import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';

interface ReservaService {
  pagarReserva(id: number): Observable<any>;
  deleteReserva(id: number): Observable<any>;
}

export interface ReservaTaxi {
  taxi: { id: number };
  user: { id: number };
  dataHora: Date;
  origen: string;
  desti: string;
  distanciaKm: number;
  preu: number;
  pagada: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ReservaTaxiService implements ReservaService {

  private apiUrl = '${environment.apiUrl}/reservas-taxis';

  constructor(private http: HttpClient) {}

  // Crear una nueva reserva de taxi
  createReserva(reserva: {
    taxiId: number;
    userId: number;
    dataHora: string;
    origen: string;
    desti: string;
    distanciaKm: number;
    preu: number;
  }): Observable<ReservaTaxi> {
    const body = {
      taxi: { id: reserva.taxiId },
      user: { id: reserva.userId },
      dataHora: reserva.dataHora,
      origen: reserva.origen,
      desti: reserva.desti,
      distanciaKm: reserva.distanciaKm,
      preu: reserva.preu,
      pagada: false
    };

    return this.http.post<ReservaTaxi>(this.apiUrl, body);
  }

  // Obtener todas las reservas de taxi
  getReservasTaxi(): Observable<ReservaTaxi[]> {
    return this.http.get<ReservaTaxi[]>(this.apiUrl);
  }

  // Obtener reservas por taxi
  getReservasByTaxi(taxiId: number): Observable<ReservaTaxi[]> {
    return this.http.get<ReservaTaxi[]>(`${this.apiUrl}/taxi/${taxiId}`);
  }

  // Obtener reservas por usuario
  getReservasTaxiByUser(userId: string): Observable<ReservaTaxi[]> {
    return this.http.get<ReservaTaxi[]>(`${this.apiUrl}/user/${userId}`);
  }

  updateReservaTaxi(id: number, reserva: ReservaTaxi): Observable<ReservaTaxi> {
    return this.http.put<ReservaTaxi>(`${this.apiUrl}/${id}`, reserva);
  }

  // Marcar reserva como pagada
  pagarReserva(reservaId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${reservaId}/pagar`, {});
  }

  // Borrar reserva
  deleteReserva(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
