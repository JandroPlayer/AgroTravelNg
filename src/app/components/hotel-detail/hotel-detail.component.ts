import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { HotelService } from '../../services/hotel.service';
import {CurrencyPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  imports: [
    RouterLink,
    NgIf,
    CurrencyPipe
  ],
  styleUrls: ['./hotel-detail.component.css']
})
export class HotelDetailComponent implements OnInit {
  hotel: any; // Aquí es guarda l'hotel carregat

  constructor(private route: ActivatedRoute, private hotelService: HotelService) {}

  ngOnInit(): void {
    const hotelId = this.route.snapshot.paramMap.get('id');
    console.log('ID de l\'hotel:', hotelId); // Verifica que es rep l'ID correctament

    if (hotelId) {
      this.hotelService.getHotelById(hotelId).subscribe({
        next: (data) => {
          console.log('Dades de l\'API:', data);
          this.hotel = data; // Assignar les dades a la variable
        },
        error: (error) => console.error('Error carregant l\'hotel:', error)
      });
    }
  }
}

