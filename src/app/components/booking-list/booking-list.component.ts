import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { HotelService } from '../../services/hotel.service';
import { UserService } from '../../services/user.service';
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import {ReservaAutobusService} from '../../services/reservautobus.service';
import {MatSnackBar} from '@angular/material/snack-bar';

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
    private snackBar: MatSnackBar
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

  pagarReserva(booking: any): void {
    const user = this.userService.getUser();

    if (!user) {
      this.showSnackbar('Has d’iniciar sessió per pagar.', false);
      return;
    }

    // Marcar como "Pagant..."
    booking.pagant = true;

    // Realizar la petición de pago del usuario
    this.userService.payForUser(user.id, booking.preu).subscribe({
      next: (updatedUser) => {
        // Si el pago es exitoso, actualizar el estado del usuario
        this.userService.setUser(updatedUser);

        // Llamar al backend para marcar la reserva como pagada
        this.reservaAutobusService.pagarReserva(booking.id).subscribe({
          next: () => {
            // Actualizar el estado de la reserva como pagada
            booking.pagada = true;
            this.showSnackbar('Pagament realitzat amb èxit.', true);
          }
        });
      },
      error: (err) => {
        booking.pagant = false;
        const missatge = err?.error?.message || 'Error en el pagament.';
        this.showSnackbar(missatge, false);
      },
      complete: () => {
        booking.pagant = false;
      }
    });
  }

  cancelarReserva(reservaId: number): void {
    if (confirm('Estàs segur que vols cancel·lar aquesta reserva?')) {
      this.reservaAutobusService.deleteReserva(reservaId).subscribe({
        next: () => {
          // Elimina la reserva localment de la llista
          this.busBookings = this.busBookings.filter(r => r.id !== reservaId);
        },
        error: (err) => {
          console.error('Error en cancel·lar la reserva:', err);
          alert('No s\'ha pogut cancel·lar la reserva. Torna-ho a intentar.');
        }
      });
    }
  }



  showSnackbar(message: string, isSuccess: boolean) {
    const snackType = isSuccess ? 'success' : 'error';
    this.snackBar.open(message, '', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: [snackType]
    });
  }
}
