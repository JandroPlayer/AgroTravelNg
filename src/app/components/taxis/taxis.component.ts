import { Component } from '@angular/core';
import {GoogleMap, MapMarker} from '@angular/google-maps';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-taxis',
  templateUrl: './taxis.component.html',
  imports: [
    GoogleMap,
    MapMarker,
    NgForOf
  ]
})
export class TaxisComponent {
  rutas = [
    { nombre: 'Taxi Centre - Aeroport', origen: 'Centre', destino: 'Aeroport El Prat' },
    { nombre: 'Taxi Nord - Estació', origen: 'Horta', destino: 'Sants Estació' }
  ];

  center = { lat: 41.3902, lng: 2.1540 };
  zoom = 12;
  markers = [
    { position: { lat: 41.3902, lng: 2.154 }, label: 'T1', title: 'Taxi Centre' },
    { position: { lat: 41.43, lng: 2.14 }, label: 'T2', title: 'Taxi Nord' }
  ];
}
