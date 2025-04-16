import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { HotelService } from '../../services/hotel.service';  // Inyectamos el HotelService
import { UserService } from '../../services/user.service';
import {DatePipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  imports: [
    NgIf,
    DatePipe,
    NgForOf
  ],
  styleUrls: ['./booking-list.component.css']
})
export class BookingListComponent implements OnInit {
  bookings: any[] = [];
  user: any = {};
  currentUserId: string = '';

  constructor(
    private bookingService: BookingService,
    private hotelService: HotelService,  // Inyectamos el HotelService
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Obtener el usuario desde el UserService
    this.user = this.userService.getUser();
    if (this.user) {
      this.currentUserId = this.user.id;
    }

    // Obtener las reservas del usuario
    this.bookingService.getBookingsByUser(this.currentUserId).subscribe(data => {
      this.bookings = data;
      this.loadHotelNames();  // Llamamos al metodo para cargar los nombres de los hoteles
    });
  }

  loadHotelNames(): void {
    this.bookings.forEach((booking) => {
      // Acceder al hotel.id dentro de cada reserva
      const hotelId = booking.hotel.id;  // Aquí usamos hotel.id

      if (hotelId) {
        this.hotelService.getHotelById(hotelId).subscribe(hotelData => {
          booking.hotelName = hotelData.name;  // Asignamos el nombre del hotel a la reserva
        });
      } else {
        console.log('El id del hotel es undefined o null');
      }
    });
  }
}
