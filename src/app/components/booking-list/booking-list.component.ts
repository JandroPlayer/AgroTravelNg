import {Component, OnInit} from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { HotelService } from '../../services/hotel.service';
import { UserService } from '../../services/user.service';
import { CurrencyPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import {ReservaAutobus, ReservaAutobusService} from '../../services/reservautobus.service';
import {Logica} from '../../logica/logica';
import {ReservaTaxiService} from '../../services/reservataxi.service';

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
  taxiBookings: any[] = [];
  user: any = {};
  currentUserId: string = '';
  hotelCache: Map<number, any> = new Map();

  constructor(
    private reservaAutobusService: ReservaAutobusService,
    private bookingService: BookingService,
    private reservaTaxiService: ReservaTaxiService,
    private hotelService: HotelService,
    private userService: UserService,
    private logica: Logica,
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUser();
    if (this.user) {
      this.currentUserId = this.user.id;

      this.bookingService.getBookingsByUser(this.currentUserId).subscribe(data => {
        this.bookings = data;
        this.loadHotelData();
      });

      this.reservaAutobusService.getReservasAutobusByUser(this.currentUserId).subscribe(data => {
        this.busBookings = data;
      });

      this.reservaTaxiService.getReservasTaxiByUser(this.currentUserId).subscribe(data => {
        this.taxiBookings = data;
      });

    }
  }

  loadHotelData(): void {
    this.bookings.forEach((booking) => {
      const hotelId = booking.hotel?.id;
      if (hotelId) {
        if (this.hotelCache.has(hotelId)) {
          const hotel = this.hotelCache.get(hotelId);
          this.attachHotelData(booking, hotel);
        } else {
          this.hotelService.getHotelByIdWithOutActivitats(hotelId).subscribe(hotelData => {
            this.hotelCache.set(hotelId, hotelData);
            this.attachHotelData(booking, hotelData);
          });
        }
      }
    });
  }

  attachHotelData(booking: any, hotel: any): void {
    booking.hotelName = hotel.name;
    booking.hotelLat = hotel.lat;
    booking.hotelLng = hotel.lng;
  }

  pagarReserva(booking: any): void {
    const user = this.userService.getUser();
    if (!user) {
      this.logica.showSnackBar('Has d’iniciar sessió per pagar.', 'error');
      return;
    }

    booking.pagant = true;

    this.userService.payForUser(user.id, booking.preu).subscribe({
      next: (updatedUser) => {
        this.userService.setUser(updatedUser);
        this.reservaAutobusService.pagarReserva(booking.id).subscribe({
          next: () => {
            booking.pagada = true;  // Cambiar el estado a "pagada"
            this.logica.showSnackBar('Pagament realitzat amb èxit.', 'success');
          },
          error: (err) => {
            booking.pagant = false;
            const missatge = err?.error?.message || 'Error en el pagament.';
            this.logica.showSnackBar(missatge, 'error');
          },
          complete: () => {
            booking.pagant = false;
          }
        });
      },
      error: (err) => {
        booking.pagant = false;
        const missatge = err?.error?.message || 'Error en el pagament.';
        this.logica.showSnackBar(missatge, 'error');
      }
    });
  }

  // Mètode para cargar todas las reservas desde el backend
  carregarReserves(): void {
    this.reservaAutobusService.getReservas().subscribe({
      next: (reservas: ReservaAutobus[]) => {
        // Actualizar la lista de reservas local
        this.busBookings = reservas;
        console.log('Reservas actualizadas:', this.busBookings);
      },
      error: (err) => {
        this.logica.showSnackBar('Error al cargar las reservas.', 'error');
        console.error('Error al cargar reservas:', err);
      }
    });
  }

  // Metode per utilitzar l'endpoint que carrega les activitats properes de l'hotel de la reserva
  onVeureActivitats(booking: any): void {
    this.logica.showSnackBar('Carregant...', 'info');  // Aquí s'envia 'info'

    this.bookingService.loadActivitatsPerReserva(booking.id).subscribe({
      next: (resposta) => {
        this.logica.showSnackBar(resposta, 'success');  // Aquí s'envia 'success'

        const queryParams = {
          lat: booking.hotelLat,
          lng: booking.hotelLng,
          name: booking.hotelName
        };

        setTimeout(() => {
          window.location.href = `/activitats?lat=${queryParams.lat}&lng=${queryParams.lng}&name=${encodeURIComponent(queryParams.name)}`;
        }, 500);
      },
      error: (err) => {
        const missatge = err?.error?.message || 'Error carregant activitats.';
        this.logica.showSnackBar(missatge, 'error');  // Aquí s'envia 'error'
      }
    });
  }

  cancelarReserva(booking: ReservaAutobus): void {
    if (!confirm('Estàs segur que vols cancel·lar aquesta reserva?')) {
      return;
    }

    booking.cancelant = true;

    this.reservaAutobusService.deleteReserva(booking.id).subscribe({
      next: () => {
        this.logica.showSnackBar('Reserva cancel·lada correctament.', 'success');
        this.carregarReserves(); // Refresca la llista
      },
      error: (err) => {
        const missatge = err?.error?.message || 'Error al cancel·lar la reserva.';
        this.logica.showSnackBar(missatge, 'error');
        console.error('Error al cancel·lar reserva:', err);
      },
      complete: () => {
        booking.cancelant = false;
      }
    });
  }

}
