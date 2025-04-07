import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definir una interfaz para la respuesta del login
interface UserResponse {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  img: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) {}

  register(user: { name: string, email: string, password: string }): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/register`, user);
  }

  // Cambiar el tipo de retorno para que sea un objeto de tipo UserResponse
  login(user: { email: string, password: string }): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/login`, user);
  }
}
