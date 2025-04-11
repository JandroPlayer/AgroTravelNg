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
    private bookingService: BookingService
  ) {
  }

  ngOnInit(): void {
    const hotelId = this.route.snapshot.paramMap.get('id');
    if (hotelId) {
      this.hotelService.getHotelById(hotelId).subscribe({
        next: (data) => {
          this.hotel = data;
        },
        error: (error) => console.error('Error cargando el hotel:', error)
      });
    }
  }

  confirmBooking(): void {
    if (!this.startDate || !this.endDate || !this.hotel) {
      alert('Por favor selecciona las fechas y completa todos los campos');
      return;
    }

    const booking = {
      hotel: {
        id: this.hotel.id // 🔥 Enviar como objeto para que pueda mapearse
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
        console.error('Error al confirmar la reserva:', err);
        alert('Hubo un problema al realizar la reserva');
      }
    });
  }
}

