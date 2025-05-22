import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:8080/api/reservas-autobus';

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
  getReservas(): Observable<ReservaAutobus[]> {
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

  // reserva.service.ts
  pagarReserva(reservaId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${reservaId}/pagar`, {});
  }

  deleteReserva(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
