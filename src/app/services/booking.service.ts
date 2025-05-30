import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ReservaService {
  pagarReserva(id: number): Observable<any>;
  deleteReserva(id: number): Observable<any>;
}

export interface Booking {
  id: string;  // Agregar el campo 'id'
  hotel: { id: number };
  user: {
    id: number;
  };
  startDate: Date;
  endDate: Date;
  adults: number;
  children: number;
  rooms: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService implements ReservaService {
  private apiUrl = '${environment.apiUrl}/reservas';

  constructor(private http: HttpClient) {}

  addBooking(booking: {
    hotel: { id: number }; // Aquí debe estar el objeto hotel con el id
    startDate: Date;
    endDate: Date;
    adults: number;
    children: number;
    rooms: number;
  }): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  getReservasHotel(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  getBookingsByHotel(hotelId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/hotel/${hotelId}`);
  }

  updateReservaHotel(id: string, reserva: Booking): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/${id}`, reserva);
  }

  getBookingsByUser(userId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/usuario/${userId}`);
  }

  loadActivitatsPerReserva(idReserva: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/${idReserva}/activitats/load`, { responseType: 'text' });
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
