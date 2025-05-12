import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HotelService } from '../../services/hotel.service';
import { BookingService } from '../../services/booking.service';
import { UserService } from '../../services/user.service';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { NavbarComponent } from '../navbar/navbar.component';
import {Logica} from '../../logica/logica';

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
    RouterLink,
    NavbarComponent
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
    private userService: UserService,
    private logica: Logica
  ) {}

  ngOnInit(): void {
    const hotelId = this.route.snapshot.paramMap.get('id');
    if (hotelId) {
      this.hotelService.getHotelByIdWithOutActivitats(hotelId).subscribe({
        next: (data) => {
          this.hotel = data;
          console.log('Hotel carregat: ', this.hotel);
        },
        error: (error) => this.logica.showSnackBar('Error carregant l’hotel: ' + error, 'error')
      });
    }
  }

  confirmBooking(): void {
    if (!this.startDate || !this.endDate || !this.hotel) {
      this.logica.showSnackBar('Per favor selecciona les dates i completa tots els camps', 'error');
      return;
    }

    const user = this.userService.getUser();
    if (!user) {
      this.logica.showSnackBar('Has d’estar autenticat per fer una reserva.', 'error');
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
        this.logica.showSnackBar('Reserva confirmada amb èxit!', 'success');
      },
      error: (err) => {
        console.error('Error al confirmar la reserva:', err);
        this.logica.showSnackBar('Hi ha hagut un problema al realitzar la reserva', 'error');
      }
    });
  }
}
