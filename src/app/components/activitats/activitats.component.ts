import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { Activitat, ActivitatsService } from '../../services/activitats.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mapa-activitats',
  templateUrl: './activitats.component.html',
  imports: [
    NavbarComponent,
  ]
})
export class ActivitatsComponent implements OnInit, AfterViewInit {
  @Input() latHotel!: number;
  @Input() lngHotel!: number;
  @Input() radius: number = 10; // km
  @Input() hotelName: string = 'Hotel Desconocido'; // Nombre del hotel, puedes pasarlo como Input también
  activitats: Activitat[] = [];
  map: google.maps.Map | undefined;

  constructor(
    private activitatsService: ActivitatsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener los parámetros de la URL si se proporcionan
    this.route.queryParams.subscribe(params => {
      const lat = parseFloat(params['lat']);
      const lng = parseFloat(params['lng']);

      // Si las coordenadas están en la URL, usarlas
      if (!isNaN(lat) && !isNaN(lng)) {
        this.latHotel = lat;
        this.lngHotel = lng;
      }

      // Obtener actividades en base a la ubicación y radio
      // Ya con coordenadas, cargar les activitats
      this.activitatsService.getActivitatsByLocation(this.latHotel, this.lngHotel, this.radius)
        .subscribe(data => {
          this.activitats = data;
          this.activitats.forEach(activitat => {
            const lat_activitat = parseFloat(String(activitat.lat_activitat));
            const lng_activitat = parseFloat(String(activitat.lng_activitat));
            if (!isNaN(lat_activitat) && !isNaN(lng_activitat)) {
              this.addMarker({ lat: lat_activitat, lng: lng_activitat }, activitat.nom, 'activity');
            }
          });
        });

      this.initMap(this.latHotel, this.lngHotel);
    });
  }

  ngAfterViewInit(): void {
    // Inicializar el mapa después de que la vista se haya cargado
    this.initMap(this.latHotel, this.lngHotel);
  }

  initMap(lat: number, lng: number): void {
    const mapElement = document.getElementById('map') as HTMLElement;

    if (mapElement) {
      const mapOptions: google.maps.MapOptions = {
        center: { lat: lat, lng: lng },
        zoom: 12
      };

      this.map = new google.maps.Map(mapElement, mapOptions);

      // Agregar marcador para el hotel (azul y con nombre)
      this.addMarker({ lat: this.latHotel, lng: this.lngHotel }, this.hotelName, 'hotel');
    } else {
      console.error('No se encontró el contenedor del mapa con id "map".');
    }
  }

  addMarker(position: { lat: number, lng: number }, title: string, type: string): void {
    if (this.map) {
      let iconUrl = '';
      if (type === 'hotel') {
        iconUrl = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'; // Icono azul para el hotel
      } else if (type === 'activity') {
        iconUrl = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'; // Icono rojo para las actividades (puedes cambiarlo)
      }

      new google.maps.Marker({
        position: position,
        map: this.map,
        title: title,
        icon: iconUrl
      });
    }
  }
}
