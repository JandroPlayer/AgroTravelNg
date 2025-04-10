import {Component, OnInit} from '@angular/core';
import {HotelService} from '../../services/hotel.service';
import {UserService} from '../../services/user.service';
import {NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  templateUrl: './hotel-list.component.html',
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    FormsModule,
  ],
  styleUrls: ['./hotel-list.component.css']
})
export class HotelListComponent implements OnInit {
  hotels: any[] = [];
  filteredHotels: any[] = [];

  filtroNombre: string = '';
  filtroRating: number = 0;

  user: any = {};
  currentUserId: string = '';

  constructor(
    private hotelService: HotelService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.hotelService.getHotels().subscribe(data => {
      this.hotels = data;
      this.aplicarFiltros();
    });

    this.route.queryParams.subscribe(params => {
      const user = params['user'];
      if (user) {
        this.user = JSON.parse(user);
        this.currentUserId = this.user.id;
      } else {
        console.error('No se recibió el objeto de usuario');
      }
    });
  }

  aplicarFiltros() {
    this.filteredHotels = this.hotels.filter(hotel => {
      return hotel.name.toLowerCase().includes(this.filtroNombre.toLowerCase());
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
  }
}
