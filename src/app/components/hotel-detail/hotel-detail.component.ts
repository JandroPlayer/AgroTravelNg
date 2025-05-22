import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HotelService } from '../../services/hotel.service';
import { BookingService } from '../../services/booking.service';
import { UserService } from '../../services/user.service';
import {CurrencyPipe, NgIf} from '@angular/common';
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
    NavbarComponent,
    CurrencyPipe
  ],
  styleUrls: ['./hotel-detail.component.css']
})
export class HotelDetailComponent implements OnInit {
  hotel: any;
  startDate!: Date;
  endDate!: Date;
  pricePerNight!: number; // precio por noche que viene del hotel
  totalPrice: number = 0;
  numAdults: number = 2;
  numChildren: number = 0;
  numRooms: number = 1;
  availableRooms: number = 0;
  favoritos: any[] = [];
  user: any = {};

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
    private bookingService: BookingService,
    private userService: UserService,
    private logica: Logica,
  ) {
  }

  ngOnInit(): void {
    this.user = this.userService.getUser();
    const hotelId = this.route.snapshot.paramMap.get('id');
    if (hotelId) {
      this.hotelService.getHotelByIdWithOutActivitats(hotelId).subscribe({
        next: (data) => {
          this.hotel = data;
          this.pricePerNight = this.hotel.pricePerNight;
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

    if (this.numAdults < 1 || this.numAdults > 30) {
      this.logica.showSnackBar('El nombre d\'adults ha de ser entre 1 i 30', 'error');
      return;
    }

    if (this.numChildren < 0 || this.numChildren > 10) {
      this.logica.showSnackBar('El nombre de nens ha de ser entre 0 i 10', 'error');
      return;
    }

    if (this.numRooms < 1 || this.numRooms > this.hotel.availableRooms) {
      this.logica.showSnackBar(`El nombre d'habitacions ha de ser entre 1 i ${this.hotel.availableRooms}`, 'error');
      return;
    }

    const user = this.userService.getUser();
    if (!user) {
      this.logica.showSnackBar('Has d’estar autenticat per fer una reserva.', 'error');
      return;
    }

    this.calcularTotalReserva();

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
      rooms: this.numRooms, // habitaciones que selecciona el usuario
      pricePerNight: this.pricePerNight,
      preu: this.totalPrice,
      availableRooms: this.availableRooms // habitaciones disponibles del hotel
    };


    this.bookingService.addBooking(booking).subscribe({
      next: (response) => {
        console.log('Reserva confirmada:', response);
        this.logica.showSnackBar('Reserva confirmada amb èxit!', 'success');

        // Actualizamos habitaciones disponibles
        this.hotelService.updateAvailableRooms(this.hotel.id, this.numRooms).subscribe({
          next: () => {
            this.hotel.availableRooms -= this.numRooms;  // Actualizamos localmente también
            console.log('Habitacions disponibles actualitzades');
          },
          error: (err) => {
            console.error('Error al actualitzar les habitacions disponibles:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error al confirmar la reserva:', err);
        this.logica.showSnackBar('Hi ha hagut un problema al realitzar la reserva', 'error');
      }
    });
  }


  calcularTotalReserva(): void {
    if (!this.startDate || !this.endDate) {
      this.totalPrice = 0;
      return;
    }

    const diffTime = this.endDate.getTime() - this.startDate.getTime();
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) diffDays = 1;

    // Personas ponderadas: adultos + 0.5 * niños
    const personasPonderadas = this.numAdults + 0.5 * this.numChildren;

    // Total = días * precio por noche * número de habitaciones * personas ponderadas
    this.totalPrice = diffDays * this.pricePerNight * this.numRooms * personasPonderadas;
  }

  addFavorite(hotelId: string): void {
    this.logica.addFavoritHotel(hotelId, this.user?.id || '', this.favoritos, this.userService);
  }
}

