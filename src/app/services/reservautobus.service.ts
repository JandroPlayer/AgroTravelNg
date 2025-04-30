import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReservaAutobus {
  id: string;
  autobus: { id: number };      // Referencia al autobús
  fechaReserva: Date;           // Fecha y hora combinadas
  numPassatgers: number;        // Número de pasajeros
  user: { id: number };         // Usuario que hace la reserva
}

@Injectable({
  providedIn: 'root'
})
export class ReservaAutobusService {
  private apiUrl = 'http://localhost:8080/api/reservas-autobus';

  constructor(private http: HttpClient) {}

  // Crear una nueva reserva de autobús
  createReserva(reserva: {
    autobusId: number;
    numPassatgers: number;
    fechaReserva: string;
    userId: number;
  }): Observable<ReservaAutobus> {
    const body = {
      autobus: { id: reserva.autobusId },
      user: { id: reserva.userId },
      dataHora: reserva.fechaReserva,
      num_passatgers: reserva.numPassatgers
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
}
