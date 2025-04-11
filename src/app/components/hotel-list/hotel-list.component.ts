import { Component, OnInit } from '@angular/core';
import { HotelService } from '../../services/hotel.service';
import { UserService } from '../../services/user.service';  // Importamos el UserService
import { NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  templateUrl: './hotel-list.component.html',
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    FormsModule,
  ],
  styleUrls: ['./hotel-list.component.css']
})
export class HotelListComponent implements OnInit {
  hotels: any[] = [];
  filteredHotels: any[] = [];

  filtroNombre: string = '';

  user: any = {};
  currentUserId: string = '';

  constructor(
    private hotelService: HotelService,
    private userService: UserService,  // Inyectamos el UserService
  ) {}

  ngOnInit(): void {
    // Obtener el usuario desde el UserService
    this.user = this.userService.getUser(); // Ahora obtenemos el usuario desde el servicio

    // Verificamos si el usuario existe y asignamos su ID
    if (this.user) {
      this.currentUserId = this.user.id;
    } else {
      console.error('No se ha encontrado el usuario');
    }

    // Obtener los hoteles
    this.hotelService.getHotels().subscribe(data => {
      this.hotels = data;
      this.aplicarFiltros();
    });
  }

  aplicarFiltros() {
    this.filteredHotels = this.hotels.filter(hotel => {
      return hotel.name.toLowerCase().includes(this.filtroNombre.toLowerCase());
    });
  }

  logout() {
    this.userService.clearUser();  // Limpiar usuario del servicio
    localStorage.removeItem('token');
    window.location.href = '/login';  // Redirigir al login
  }
}
