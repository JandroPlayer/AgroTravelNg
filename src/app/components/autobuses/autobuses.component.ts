import { Component, OnInit } from '@angular/core';
import { VehiclesElectricsService, Autobus } from '../../services/vehicleselectrics.service';
import { GoogleMap } from '@angular/google-maps';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {NavbarComponent} from '../navbar/navbar.component';

@Component({
  selector: 'app-autobuses',
  templateUrl: './autobuses.component.html',
  standalone: true,
  imports: [
    GoogleMap,
    NgForOf,
    NgIf,
    NavbarComponent,
    RouterLink,
    CurrencyPipe
  ]
})
export class AutobusesComponent implements OnInit {
  autobusos: Autobus[] = [];

  // Palma de Mallorca
  center = { lat: 39.5696, lng: 2.6502 };
  zoom = 8;

  constructor(
    private vehiclesElectricsService: VehiclesElectricsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.vehiclesElectricsService.getAutobusos().subscribe(data => {
      this.autobusos = data;
    });
  }

  // Navegar a /busmap
  goToBusMap() {
    this.router.navigate(['/busmap']);
  }
}
