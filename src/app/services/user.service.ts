import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Hotel} from './hotel.service';

// Interfície per a la resposta de login
export interface UserResponse {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  img: string;
  saldo: string;
  isAdmin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '${environment.apiUrl}/users';
  private currentUser: any;

  constructor(private http: HttpClient) {}

  // Autenticació
  register(user: { name: string; email: string; password: string }): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/register`, user);
  }

  login(user: { email: string; password: string }): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/login`, user);
  }

  // Gestió local de l'usuari
  getUser(): any {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
  }

  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.apiUrl}/`);
  }

  setUser(user: any): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  clearUser(): void {
    localStorage.removeItem('currentUser');
  }

  // Consultes i modificacions remotes
  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, userData);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  payForUser(userId: number, amount: number): Observable<any> {
    const paymentRequest = { amount };
    return this.http.put<any>(`${this.apiUrl}/${userId}/pay`, paymentRequest);
  }

  // Favorits
  getFavoritos(userId: string): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.apiUrl}/${userId}/favorits`);
  }

  addFavorite(userId: string, hotelId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}/favorits/${hotelId}`, {});
  }

  removeFavorite(userId: string, hotelId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/favorits/${hotelId}`);
  }
}
