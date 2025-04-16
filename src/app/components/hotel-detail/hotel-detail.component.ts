import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HotelService } from '../../services/hotel.service';
import { BookingService } from '../../services/booking.service';
import { UserService } from '../../services/user.service'; // ✅ Importat
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {
  MatFormFieldModule
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatNativeDateModule,
    MatDatepickerToggle,
    RouterLink
  ],
  styleUrls: ['./hotel-detail.component.css']
})
export class HotelDetailComponent implements OnInit {
  hotel: any;
  startDate: Date | null = null;
  endDate: Date | null = null;
  numAdults: number = 2;
  numChildren: number = 0;
  numRooms: number = 1;

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
    private bookingService: BookingService,
    private userService: UserService // ✅ Injectat
  ) {}

  ngOnInit(): void {
    const hotelId = this.route.snapshot.paramMap.get('id');
    if (hotelId) {
      this.hotelService.getHotelById(hotelId).subscribe({
        next: (data) => {
          this.hotel = data;
          console.log("Hotel carregat: ", this.hotel);
        },
        error: (error) => console.error('Error carregant l’hotel:', error)
      });
    }
  }

  confirmBooking(): void {
    if (!this.startDate || !this.endDate || !this.hotel) {
      alert('Per favor selecciona les dates i completa tots els camps');
      return;
    }

    const user = this.userService.getUser(); // ✅ Obtenim l'usuari del localStorage
    if (!user) {
      alert('Has d’estar autenticat per fer una reserva.');
      return;
    }

    const booking = {
      hotel: {
        id: this.hotel.id
      },
      user: {
        id: user.id // ✅ Assignem l'id de l’usuari
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
        alert('Reserva confirmada amb èxit!');
      },
      error: (err) => {
        console.error('Error al confirmar la reserva:', err);
        alert('Hi ha hagut un problema al realitzar la reserva');
      }
    });
  }
}
