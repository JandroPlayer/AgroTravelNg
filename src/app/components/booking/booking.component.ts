import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { HotelService } from '../../services/hotel.service';
import { FormsModule } from '@angular/forms';
import {MatDatepickerModule, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatNativeDateModule} from '@angular/material/core';
import {NgIf} from '@angular/common';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  imports: [
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatNativeDateModule,
    MatDatepickerToggle,
    NgIf
  ],
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  hotel: any;
  startDate: Date | null = null;
  endDate: Date | null = null;
  numAdults: number = 2;
  numChildren: number = 0;
  numRooms: number = 1;
  selectedDate: Date | null = null;

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
    private bookingService: BookingService,
    private userService: UserService
  ) {
  }


  ngOnInit(): void {
    const hotelId = this.route.snapshot.paramMap.get('id');
    if (hotelId) {
      this.hotelService.getHotelById(hotelId).subscribe({
        next: (data) => {
          this.hotel = data;
        },
        error: (error) => console.error()
      });
    }
  }

  confirmBooking(): void {
    if (!this.startDate || !this.endDate || !this.hotel) {
      alert('Por favor selecciona las fechas y completa todos los campos');
      return;
    }

    const user = this.userService.getUser();

    if (!user || !user.id) {
      alert('Debes iniciar sesión para hacer una reserva');
      return;
    }

    const booking = {
      hotel: {
        id: this.hotel.id
      },
      user: {
        id: user.id
      },
      startDate: this.startDate,
      endDate: this.endDate,
      adults: this.numAdults,
      children: this.numChildren,
      rooms: this.numRooms
    };

    this.bookingService.addBooking(booking).subscribe({
      next: (response) => {
        console.log('Reserva confirmada:', response);
        alert('Reserva confirmada con éxito!');
      },
      error: (err) => {
        console.error();
        alert('Hubo un problema al realizar la reserva');
      }
    });
  }
}

