import { Component, OnInit } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { UserService } from '../../services/user.service';
import { HotelService } from '../../services/hotel.service';
import {Logica} from '../../logica/logica';
import {NgForOf, NgIf} from '@angular/common';
import {NavbarComponent} from '../navbar/navbar.component';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  imports: [
    RouterLink,
    NgForOf,
    NavbarComponent,
    NgIf
  ],
})
export class FavoritosComponent implements OnInit {
  user: any;
  favoritos: any[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private hotelService: HotelService,
    private logica: Logica // Inyectamos el servicio de snackbar
  ) { }

  ngOnInit(): void {
    this.user = this.userService.getUser(); // Obtener el usuario logueado
    if (this.user) {
      // Aquí puedes obtener los favoritos del usuario a través de un servicio
      this.userService.getFavoritos(this.user.id).subscribe(
        (data: any) => {
          this.favoritos = data;
        },
        (error) => {
          console.error();
        }
      );
    } else {
      this.router.navigate(['/login']); // Si no hay usuario logueado, redirigir al login
    }
  }

  // Metodo para eliminar un hotel de los favoritos
  removeFavorite(hotelId: string): void {
    const currentUserId = this.user.id;  // Asegúrate de tener el id del usuario
    if (currentUserId) {
      this.userService.removeFavorite(currentUserId, hotelId).subscribe(() => {
        // Mostrar mensaje de éxito al eliminar
        this.logica.showSnackBar('Hotel eliminado de favoritos correctamente', 'success');

        // Actualizamos el estado de favoritos en la lista de hoteles
        this.favoritos = this.favoritos.filter(h => h.id !== hotelId);  // Eliminar de la lista
      }, error => {
        // Mostrar mensaje de error si ocurre un problema al eliminar
        this.logica.showSnackBar('Error al eliminar el hotel de favoritos', 'error');
      });
    }
  }


}
