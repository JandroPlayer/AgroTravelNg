import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/users';
  private currentUser: any;  // Variable privada para almacenar el usuario

  constructor(private http: HttpClient) {}

  // Método para obtener el usuario del localStorage o desde la API si no está disponible
  getUser(): any {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      return JSON.parse(currentUser);  // Si el usuario está en localStorage, lo devolvemos
    }
    return null;  // Si no está, devolvemos null
  }

  setUser(user: any): void {
    localStorage.setItem('currentUser', JSON.stringify(user));  // Guardamos el usuario en localStorage
  }

  clearUser(): void {
    localStorage.removeItem('currentUser');  // Limpiamos el usuario de localStorage
  }

  // Obtener usuario por ID desde la API
  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Actualizar los datos del usuario en la API
  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, userData);
  }
}
