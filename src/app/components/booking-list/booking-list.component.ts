import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { HotelService } from '../../services/hotel.service';
import { UserService } from '../../services/user.service';
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import {ReservaAutobusService} from '../../services/reservautobus.service';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  imports: [
    NgIf,
    DatePipe,
    NgForOf,
    NavbarComponent,
    CurrencyPipe
  ],
  styleUrls: ['./booking-list.component.css']
})
export class BookingListComponent implements OnInit {
  bookings: any[] = [];
  busBookings: any[] = [];
  user: any = {};
  currentUserId: string = '';

  constructor(
    private reservaAutobusService: ReservaAutobusService,
    private bookingService: BookingService,
    private hotelService: HotelService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUser();
    if (this.user) {
      this.currentUserId = this.user.id;

      // Cargar reservas de hotel
      this.bookingService.getBookingsByUser(this.currentUserId).subscribe(data => {
        this.bookings = data;
        this.loadHotelNames();
      });

      // Cargar reservas de autobús
      this.reservaAutobusService.getReservasAutobusByUser(this.currentUserId).subscribe(data => {
        this.busBookings = data;
      });
    }
  }

  loadHotelNames(): void {
    this.bookings.forEach((booking) => {
      const hotelId = booking.hotel?.id;
      if (hotelId) {
        this.hotelService.getHotelById(hotelId).subscribe(hotelData => {
          booking.hotelName = hotelData.name;
        });
      }
    });
  }
}
