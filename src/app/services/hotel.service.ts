// hotel.service.ts (Servei per a la gestió d'hotels)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private apiUrl = 'http://localhost:8080/api/hotels';

  constructor(private http: HttpClient) { }

  getHotels(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getHotelById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
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
}
