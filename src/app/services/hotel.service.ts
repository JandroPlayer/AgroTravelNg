// hotel.service.ts (Servei per a la gestió d'hotels)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from './environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private apiUrl = `${environment.apiUrl}/hotels`;

  constructor(private http: HttpClient) { }

  getHotels(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getHotelById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getHotelsWithoutActivitats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/without-activities`);
  }

  getHotelByIdWithOutActivitats(hotelId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${hotelId}/without-activities`);  // Asegúrate de que este endpoint no incluya actividades
  }

  // hotel.service.ts
  updateAvailableRooms(hotelId: number, roomsBooked: number) {
    return this.http.put(`${this.apiUrl}/${hotelId}/update-available-rooms?roomsBooked=${roomsBooked}`, {});
  }

}

export interface Hotel {
  id: number;
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  phone: string;
  website: string;
  googleMapsUrl: string;
  imageUrl: string;
  pricePerNight: number;
  availableRooms: number;
}
