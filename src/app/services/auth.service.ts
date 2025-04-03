import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/users';  // Cambiar por tu endpoint real

  constructor(private http: HttpClient) {}

  register(user: { name: string, email: string, password: string }): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/register`, user);
  }

  login(user: { email: string, password: string }): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/login`, user);
  }
}
