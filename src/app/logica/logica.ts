import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class Logica {
  constructor(
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {}

  showSnackBar(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success'): void {
    this.snackBar.open(message, '', {
      duration: type === 'info' ? 3000 : 3000,
      verticalPosition: 'top',
      panelClass: [type]
    });
  }

  // Mètode genérico para pagar reserva
  pagarReservaGenerico(
    booking: any,
    reservaService: { pagarReserva(id: number): Observable<any> },
    _listaReservas: any[],
    userId: number
  ): void {
    if (!userId) {
      this.showSnackBar('Has d’iniciar sessió per pagar.', 'error');
      return;
    }

    booking.pagant = true;

    this.userService.payForUser(userId, booking.preu).subscribe({
      next: (updatedUser) => {
        this.userService.setUser(updatedUser);
        reservaService.pagarReserva(booking.id).subscribe({
          next: () => {
            booking.pagada = true;
            this.showSnackBar('Pagament realitzat amb èxit.', 'success');
          },
          error: (err) => {
            booking.pagant = false;
            const missatge = err?.error?.message || 'Error en el pagament.';
            this.showSnackBar(missatge, 'error');
          },
          complete: () => {
            booking.pagant = false;
          }
        });
      },
      error: (err) => {
        booking.pagant = false;
        const missatge = err?.error?.message || 'Error en el pagament.';
        this.showSnackBar(missatge, 'error');
      }
    });
  }

  // Mètode genérico para cancelar reserva
  cancelarReservaGenerico(
    booking: any,
    reservaService: { deleteReserva(id: number): Observable<any> },
    listaReservas: any[]
  ): void {
    if (!confirm('Estàs segur que vols cancel·lar aquesta reserva?')) {
      return;
    }

    booking.cancelant = true;

    reservaService.deleteReserva(booking.id).subscribe({
      next: () => {
        this.showSnackBar('Reserva cancel·lada correctament.', 'success');
        const index = listaReservas.findIndex(r => r.id === booking.id);
        if (index !== -1) listaReservas.splice(index, 1);
      },
      error: (err) => {
        const missatge = err?.error?.message || 'Error al cancel·lar la reserva.';
        this.showSnackBar(missatge, 'error');
      },
      complete: () => {
        booking.cancelant = false;
      }
    });
  }

  addFavoritHotel(
    hotelId: string,
    userId: string,
    favoritos: string[], // lista local de favoritos
    userService: { addFavorite(userId: string, hotelId: string): Observable<any> },
    callback?: () => void
  ): void {
    if (!userId) {
      this.showSnackBar('Has d’iniciar sessió per afegir favorits.', 'error');
      return;
    }

    if (favoritos.includes(hotelId)) {
      this.showSnackBar('Aquest hotel ja està als teus favorits', 'info');
      return;
    }

    userService.addFavorite(userId, hotelId).subscribe({
      next: (response) => {
        const msg = response?.message;
        if (msg === 'Aquest hotel ja està als teus favorits') {
          this.showSnackBar(msg, 'info');
        } else {
          this.showSnackBar(msg || 'Afegit als favorits!', 'success');
          favoritos.push(hotelId); // Actualiza la lista local
          callback?.();
        }
      },
      error: () => {
        this.showSnackBar('Error inesperat', 'error');
      }
    });
  }
}
