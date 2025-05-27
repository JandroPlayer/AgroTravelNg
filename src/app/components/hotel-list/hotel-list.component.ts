import { Component, OnInit } from '@angular/core';
import { HotelService } from '../../services/hotel.service';
import { NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { UserService } from '../../services/user.service';
import { Logica } from '../../logica/logica';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  templateUrl: './hotel-list.component.html',
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    FormsModule,
    NavbarComponent,
  ],
  styleUrls: ['./hotel-list.component.css']
})
export class HotelListComponent implements OnInit {
  hotels: any[] = [];
  filteredHotels: any[] = [];
  filtroNombre: string = '';
  filtroPreuMaxim: number | null = null;
  user: any = {};
  currentUserId: string = '';
  favoritos: any[] = [];

  constructor(
    private hotelService: HotelService,
    private userService: UserService,
    private logica: Logica
  ) {}

  ngOnInit(): void {
    // Obtener el usuario logueado
    this.user = this.userService.getUser();
    if (this.user) {
      this.currentUserId = this.user.id;  // Asignamos el ID del usuario logueado
    }

    // Obtener los hoteles
    this.hotelService.getHotelsWithoutActivitats().subscribe(data => {
      console.log(`Hoteles recibidos (${data.length}):`, data);
      this.hotels = data;
      this.aplicarFiltros();
    }, error => {
      console.error();
    });

    // Obtener los favoritos del usuario
    if (this.currentUserId) {
      this.userService.getFavoritos(this.currentUserId).subscribe(favoritos => {
        this.favoritos = favoritos;
      }, error => {
        console.error();
      });
    }
  }

  aplicarFiltros() {
    this.filteredHotels = this.hotels.filter(hotel => {
      const coincideixNom = hotel.name.toLowerCase().includes(this.filtroNombre.toLowerCase());
      const coincideixPreu = this.filtroPreuMaxim == null || hotel.pricePerNight <= this.filtroPreuMaxim;

      return coincideixNom && coincideixPreu;
    });
  }


  addFavorite(hotelId: string): void {
    this.logica.addFavoritHotel(hotelId, this.user?.id || '', this.favoritos, this.userService);
  }
}
