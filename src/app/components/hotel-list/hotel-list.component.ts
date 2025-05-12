import { Component, OnInit } from '@angular/core';
import { HotelService } from '../../services/hotel.service';
import { NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {NavbarComponent} from '../navbar/navbar.component';

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

  constructor(
    private hotelService: HotelService,
  ) {}

  ngOnInit(): void {
    // Obtener los hoteles
    this.hotelService.getHotelsWithoutActivitats().subscribe(data => {
      console.log(`Hoteles recibidos (${data.length}):`, data);
      this.hotels = data;
      this.aplicarFiltros();
    }, error => {
      console.error('Error al obtener hoteles:', error);
    });
  }

  aplicarFiltros() {
    this.filteredHotels = this.hotels.filter(hotel => {
      return hotel.name.toLowerCase().includes(this.filtroNombre.toLowerCase());
    });
  }
}
