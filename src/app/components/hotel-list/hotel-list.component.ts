import { Component, OnInit } from '@angular/core';
import { HotelService } from '../../services/hotel.service';
import { UserService } from '../../services/user.service';
import { CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  templateUrl: './hotel-list.component.html',
  imports: [
    NgIf,
    NgForOf,
    CurrencyPipe,
    RouterLink,
  ],
  styleUrls: ['./hotel-list.component.css']
})
export class HotelListComponent implements OnInit {
  hotels: any[] = [];
  user: any = {};
  currentUserId: string = '';

  constructor(
    private hotelService: HotelService,
    private userService: UserService,
    private route: ActivatedRoute  // Asegúrate de inyectar ActivatedRoute aquí
  ) {}

  ngOnInit(): void {
    // Obtener lista de hoteles
    this.hotelService.getHotels().subscribe(data => {
      this.hotels = data;
    });

    // Obtener el parámetro 'user' de la URL
    this.route.queryParams.subscribe(params => {
      const user = params['user'];
      if (user) {
        // Parsear el string JSON recibido a un objeto
        this.user = JSON.parse(user);
        console.log('Datos del usuario:', this.user);
        // Si necesitas el ID del usuario, lo puedes extraer del objeto user
        this.currentUserId = this.user.id;
      } else {
        console.error('No se recibió el objeto de usuario');
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    window.location.href = '/login';  // Redirige al login
  }
}
