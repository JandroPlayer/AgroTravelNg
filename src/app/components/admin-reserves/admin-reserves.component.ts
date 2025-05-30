import { Component, OnInit } from '@angular/core';
import {BookingService} from '../../services/booking.service';
import { ReservaAutobusService } from '../../services/reservautobus.service';
import { ReservaTaxiService } from '../../services/reservataxi.service';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { forkJoin } from 'rxjs';
import {FormsModule} from '@angular/forms';
import {Logica} from '../../logica/logica';

@Component({
  selector: 'app-admin-reserves',
  templateUrl: './admin-reserves.component.html',
  imports: [
    NgForOf,
    NavbarComponent,
    NgIf,
    CurrencyPipe,
    FormsModule,
  ],
  styleUrls: ['./admin-reserves.component.css']
})
export class AdminReservesComponent implements OnInit {
  bookings: any[] = [];
  busBookings: any[] = [];
  taxiBookings: any[] = [];

  loading = false;
  error: string | null = null;

  constructor(
    private bookingService: BookingService,
    private busBookingService: ReservaAutobusService,
    private taxiBookingService: ReservaTaxiService,
    private logica: Logica
  ) {}

  ngOnInit(): void {
    this.loadAllBookings();
  }

  loadAllBookings(): void {
    this.loading = true;
    this.error = null;

    forkJoin({
      hotelData: this.bookingService.getReservasHotel(),
      busData: this.busBookingService.getReservasAutobus(),
      taxiData: this.taxiBookingService.getReservasTaxi()
    }).subscribe({
      next: ({ hotelData, busData, taxiData }) => {
        this.bookings = hotelData;
        this.busBookings = busData;
        this.taxiBookings = taxiData;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al carregar les reserves';
        this.loading = false;
      }
    });
  }

  // Mètode per eliminar reserva d'hotel
  eliminarReservaHotel(booking: any): void {
    this.logica.confirmAndExecute(
      `Estàs segur que vols eliminar la reserva d’hotel amb ID ${booking.id}?`,
      () => {
    this.bookingService.deleteReserva(booking.id).subscribe({
      next: () => {
        this.logica.showSnackBar('Reserva d’hotel eliminada correctament.', "success");
        this.loadAllBookings(); // Recarrega la llista
      },
      error: () => {
        this.logica.showSnackBar('Error eliminant la reserva d’hotel.', "error");
      }
       });
      }
    );
  }

  // Mètode per modificar reserva d'hotel
  modificarReservaHotel(booking: any): void {
    this.bookingService.updateReservaHotel(booking.id, booking).subscribe({
      next: () => {
        this.logica.showSnackBar('Reserva d’hotel actualitzada correctament.', "success");
        this.loadAllBookings(); // Si tens un mètode per recarregar la llista
      },
      error: () => {
        this.logica.showSnackBar('Hi ha hagut un error actualitzant la reserva d’hotel.', "error");
      }
    });
  }

  // Mètode per eliminar reserva d'autobús
  eliminarReservaAutobus(booking: any): void {
    this.logica.confirmAndExecute(
      `Estàs segur que vols eliminar la reserva d’autobús amb ID ${booking.id}?`,
      () => {
        this.busBookingService.deleteReserva(booking.id).subscribe({
          next: () => {
            this.logica.showSnackBar('Reserva d’autobús eliminada correctament.', "success");
            this.loadAllBookings();
          },
          error: () => {
            this.logica.showSnackBar('Error eliminant la reserva d’autobús.', "error");
          }
        });
      }
    );
  }


// Mètode per modificar reserva d'autobús
  modificarReservaAutobus(booking: any): void {
    this.busBookingService.updateReservaAutobus(booking.id, booking).subscribe({
      next: () => {
        this.logica.showSnackBar('Reserva d’autobús actualitzada correctament.', "success");
        this.loadAllBookings();
      },
      error: () => {
        this.logica.showSnackBar('Hi ha hagut un error actualitzant la reserva d’autobús.', "error");
      }
    });
  }

// Mètode per eliminar reserva de taxi
  eliminarReservaTaxi(booking: any): void {
    this.logica.confirmAndExecute(
      `Estàs segur que vols eliminar la reserva de taxi amb ID ${booking.id}?`,
      () => {
    this.taxiBookingService.deleteReserva(booking.id).subscribe({
      next: () => {
        this.logica.showSnackBar('Reserva de taxi eliminada correctament.', "success");
        this.loadAllBookings();
      },
      error: () => {
        this.logica.showSnackBar('Error eliminant la reserva de taxi.', "error");
      }
    });
      }
    );
  }

// Mètode per modificar reserva de taxi
  modificarReservaTaxi(booking: any): void {
    this.taxiBookingService.updateReservaTaxi(booking.id, booking).subscribe({
      next: () => {
        this.logica.showSnackBar('Reserva de taxi actualitzada correctament.', "success");
        this.loadAllBookings();
      },
      error: () => {
        this.logica.showSnackBar('Hi ha hagut un error actualitzant la reserva de taxi.', "error");
      }
    });
  }

  calcularTotalReserva(booking: any): void {
    // Hoteles: cálculo por días y personas
    if (booking.startDate && booking.endDate) {
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      const diffTime = endDate.getTime() - startDate.getTime();
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 1) diffDays = 1;

      const personasPonderadas = (booking.adults || 0) + 0.5 * (booking.children || 0);
      const pricePerNight = booking.hotel?.pricePerNight || 0;
      const numRooms = booking.rooms || 1;

      booking.preu = diffDays * pricePerNight * numRooms * personasPonderadas;
      return;
    }

    // Autobuses: precio por persona
    if (booking.autobus && booking.num_passatgers !== undefined) {
      booking.preu = booking.autobus.preuPerPersona * booking.num_passatgers;
      return;
    }

    // Taxis: tarifa base + coste por km * distancia
    if (booking.taxi && booking.distanciaKm !== undefined) {
      const tarifaBase = booking.taxi.tarifaBase || 0;
      const costPerKm = booking.taxi.costPerKm || 0;
      booking.preu = +(tarifaBase + costPerKm * booking.distanciaKm).toFixed(2);
      return;
    }

    // Default si no se cumple ningún caso
    booking.preu = 0;
  }


  formatToISODate(date: Date | string | null): string | null {
    if (!date) return null;
    let d = (typeof date === 'string') ? new Date(date) : date;
    if (isNaN(d.getTime())) return null;
    return d.toISOString().substring(0, 10);
  }

  onDateChange(value: string, booking: any, field: 'startDate' | 'endDate' | 'dataHora') {
    booking[field] = value ? new Date(value) : null;
    this.calcularTotalReserva(booking);
  }

  formatToISODateTime(dateStr: string): string {
    if (!dateStr) return '';

    // Crear un Date a partir del string con formato: "5/28/25, 1:00 PM"
    const date = new Date(dateStr);

    // Comprobar que es válido
    if (isNaN(date.getTime())) return '';

    // Formatear a YYYY-MM-DDTHH:mm
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

}
