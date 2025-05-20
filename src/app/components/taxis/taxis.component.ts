import { Component, OnInit } from '@angular/core';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {Taxi, VehiclesElectricsService} from '../../services/vehicleselectrics.service';
import {NavbarComponent} from '../navbar/navbar.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-taxis',
  templateUrl: './taxis.component.html',
  imports: [
    NavbarComponent,
    NgIf,
    NgForOf,
    CurrencyPipe,
    RouterLink
  ],
})
export class TaxisComponent implements OnInit {

  taxis: Taxi[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private vehiclesService: VehiclesElectricsService) {}

  ngOnInit(): void {
    this.loadTaxis();
  }

  loadTaxis(): void {
    this.loading = true;
    this.error = null;

    this.vehiclesService.getTaxis().subscribe({
      next: (data) => {
        this.taxis = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los taxis.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
