import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HotelService, Hotel } from '../../services/hotel.service';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { NgForOf } from '@angular/common';
import {NavbarComponent} from '../navbar/navbar.component';

declare const google: any;

@Component({
  selector: 'app-bus-map',
  templateUrl: './bus-map.component.html',
  standalone: true,
  imports: [
    GoogleMap,
    MapMarker,
    NgForOf,
    NavbarComponent
  ]
})
export class BusMapComponent implements OnInit, AfterViewInit {
  @ViewChild(GoogleMap) mapRef!: GoogleMap;

  center: google.maps.LatLngLiteral = { lat: 39.5471, lng: 2.7416 };
  zoom = 8;
  map!: google.maps.Map;
  directionsService!: google.maps.DirectionsService;
  airport = { lat: 39.5471, lng: 2.7416 };

  rutas: { nombre: string, origen: string, destino: string }[] = [];
  markers: Marker[] = [];

  constructor(private hotelService: HotelService) {}

  ngOnInit() {
    this.directionsService = new google.maps.DirectionsService();
  }

  ngAfterViewInit() {
    this.map = this.mapRef.googleMap!;
    this.loadHotelesYMostrarRutas();
  }

  loadHotelesYMostrarRutas() {
    this.hotelService.getHotels().subscribe((hoteles: Hotel[]) => {
      console.log('Hoteles cargados:', hoteles);

      hoteles.forEach((hotel, index) => {
        const destino = { lat: hotel.lat, lng: hotel.lng };

        this.rutas.push({
          nombre: `Ruta ${index + 1}`,
          origen: 'Aeroport',
          destino: hotel.name
        });

        this.markers.push({
          position: destino,
          label: `${index + 1}`,
          title: hotel.name,
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            labelOrigin: new google.maps.Point(15, -10)
          }
        });


        const request = {
          origin: this.airport,
          destination: destino,
          travelMode: google.maps.TravelMode.DRIVING,
        };

        this.directionsService.route(request, (result: any, status: any) => {
          if (status === 'OK') {
            const directionsRenderer = new google.maps.DirectionsRenderer({
              suppressMarkers: true,
              preserveViewport: true,
              polylineOptions: {
                strokeColor: this.getColor(index),
                strokeOpacity: 0.7,
                strokeWeight: 4
              }
            });
            directionsRenderer.setMap(this.map);
            directionsRenderer.setDirections(result);
          } else {
            console.error(`Ruta fallida para hotel ${hotel.name}: ${status}`);
          }
        });
      });

      // Marcador del aeropuerto con emoji de avión y color verde
      this.markers.unshift({
        position: this.airport,
        label: '✈️',
        title: 'Aeroport',
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          labelOrigin: new google.maps.Point(15, 10)
        }
      });


      const bounds = new google.maps.LatLngBounds();
      this.markers.forEach(marker => {
        bounds.extend(marker.position);
      });
      this.map.fitBounds(bounds);
    });
  }

  getColor(index: number): string {
    const colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0'];
    return colors[index % colors.length];
  }
}

interface Marker {
  position: google.maps.LatLngLiteral;
  label: string;
  title: string;
  icon: string | google.maps.Icon | google.maps.Symbol
}
