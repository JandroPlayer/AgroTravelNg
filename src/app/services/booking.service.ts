import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Booking {
  hotelId: string;
  startDate: Date;
  endDate: Date;
  adults: number;
  children: number;
  rooms: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8080/api/reservas';

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

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  getBookingsByHotel(hotelId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/hotel/${hotelId}`);
  }
}

