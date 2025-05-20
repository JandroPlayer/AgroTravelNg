import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  VehiclesElectricsService,
  Taxi
} from '../../services/vehicleselectrics.service';
import { ReservaTaxiService } from '../../services/reservataxi.service';
import { UserService } from '../../services/user.service';
import { NavbarComponent } from '../navbar/navbar.component';
import {
  NgIf,
  NgForOf,
  CurrencyPipe
} from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-reserva-taxi',
  templateUrl: './reservataxi.component.html',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    NavbarComponent,
    CurrencyPipe
  ]
})
export class ReservaTaxiComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  map!: google.maps.Map;
  origenMarker!: google.maps.Marker;
  destiMarker!: google.maps.Marker;
  directionsService = new google.maps.DirectionsService();

  taxi: Taxi | null = null;
  taxis: Taxi[] = [];

  reservaForm: FormGroup;

  availableTimes: string[] = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  distanciaKm = 0;
  preuTotal = 0;

  constructor(
    private vehiclesElectricsService: VehiclesElectricsService,
    private reservaTaxiService: ReservaTaxiService,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    this.reservaForm = new FormGroup({
      origen: new FormControl({ value: '', disabled: true }, Validators.required),
      desti: new FormControl({ value: '', disabled: true }, Validators.required),
      startDate: new FormControl(null, Validators.required),
      startTime: new FormControl('', Validators.required),
      taxiId: new FormControl('', Validators.required),
      dataHora: new FormControl('', Validators.required),
      distanciaKm: new FormControl({ value: 0, disabled: true }, Validators.required),
      preuEstimat: new FormControl({ value: 0, disabled: true })
    });
  }

  ngOnInit(): void {
    const taxiIdParam = Number(this.route.snapshot.paramMap.get('id'));
    this.vehiclesElectricsService.getTaxis().subscribe((data) => {
      this.taxis = data;
      this.taxi = this.taxis.find(t => t.id === taxiIdParam) || null;
      if (this.taxi) {
        this.reservaForm.get('taxiId')?.setValue(this.taxi.id);

        // Esperar al siguiente ciclo para que Angular pinte el DOM
        setTimeout(() => {
          if (this.mapContainer) {
            this.inicialitzarMapa();
          } else {
            console.error('Map container aún no disponible tras cargar taxi');
          }
        }, 0);
      }
    });
  }

  ngAfterViewInit(): void {
  }

  inicialitzarMapa() {
    const greenMarkerWithLabelAbove = {
      url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
      labelOrigin: new google.maps.Point(15.5, 8) // X, Y — más arriba
    };

    const options = {
      center: new google.maps.LatLng(39.5696, 2.6502),
      zoom: 12
    };

    this.map = new google.maps.Map(this.mapContainer.nativeElement, options);

    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      const pos = event.latLng!;
      if (!this.origenMarker) {
        this.origenMarker = new google.maps.Marker({
          position: pos,
          map: this.map,
          label: '🚕',
          draggable: true,
          icon: greenMarkerWithLabelAbove
        });

        // ✅ Establecer valor inmediatamente
        this.reservaForm.get('origen')?.setValue(`${pos.lat()},${pos.lng()}`);

        // ❌ Eliminar marcador con clic derecho
        this.origenMarker.addListener('rightclick', () => {
          this.origenMarker.setMap(null);
          this.origenMarker = undefined!;
          this.reservaForm.get('origen')?.reset();
          this.reservaForm.get('distanciaKm')?.reset();
          this.reservaForm.get('preuEstimat')?.reset();
        });

        // ♻️ Recalcular ruta al mover marcador
        this.origenMarker.addListener('dragend', () => {
          const newPos = this.origenMarker.getPosition();
          if (newPos) {
            this.reservaForm.get('origen')?.setValue(`${newPos.lat()},${newPos.lng()}`);
            this.calcularRuta();
          }
        });

      } else if (!this.destiMarker) {
        this.destiMarker = new google.maps.Marker({
          position: pos,
          map: this.map,
          label: '🏁',
          draggable: true,
          icon: greenMarkerWithLabelAbove
        });

        // ✅ Establecer valor inmediatamente
        this.reservaForm.get('desti')?.setValue(`${pos.lat()},${pos.lng()}`);

        // ❌ Eliminar marcador con clic derecho
        this.destiMarker.addListener('rightclick', () => {
          this.destiMarker.setMap(null);
          this.destiMarker = undefined!;
          this.reservaForm.get('desti')?.reset();
          this.reservaForm.get('distanciaKm')?.reset();
          this.reservaForm.get('preuEstimat')?.reset();
        });

        // ♻️ Recalcular ruta al mover marcador
        this.destiMarker.addListener('dragend', () => {
          const newPos = this.destiMarker.getPosition();
          if (newPos) {
            this.reservaForm.get('desti')?.setValue(`${newPos.lat()},${newPos.lng()}`);
            this.calcularRuta();
          }
        });

        // ✅ Calcular ruta después de establecer destino
        this.calcularRuta();
      }
    });
  }

  calcularRuta() {
    if (!this.origenMarker || !this.destiMarker || !this.taxi) return;

    const taxi = this.taxi; // ja sabem que no és null aquí

    this.directionsService.route({
      origin: this.origenMarker.getPosition()!,
      destination: this.destiMarker.getPosition()!,
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        const distMetres = result.routes[0].legs[0].distance?.value || 0;
        this.distanciaKm = +(distMetres / 1000).toFixed(2);
        this.reservaForm.get('distanciaKm')?.setValue(this.distanciaKm);

        this.preuTotal = +(taxi.tarifaBase + taxi.costPerKm * this.distanciaKm).toFixed(2);
        this.reservaForm.get('preuEstimat')?.setValue(this.preuTotal);
      } else {
        console.error('Error en calcular ruta:', status);
      }
    });
  }

  confirmarReserva(): void {
    const startDateRaw = this.reservaForm.get('startDate')?.value;
    const startTime = this.reservaForm.get('startTime')?.value;

    const startDate = new Date(startDateRaw); // fuerza conversión a Date

    if (isNaN(startDate.getTime())) {
      alert('La data introduïda no és vàlida.');
      return;
    }

    const dataHora = `${startDate.toISOString().split('T')[0]}T${startTime}:00`;
    this.reservaForm.get('dataHora')?.setValue(dataHora);


    if (this.reservaForm.valid && this.taxi) {
      const currentUser = this.userService.getUser();
      const userId = currentUser ? currentUser.id : 1;

      const origen = this.reservaForm.get('origen')?.value;
      const desti = this.reservaForm.get('desti')?.value;
      const taxiId = this.reservaForm.get('taxiId')?.value;

      const reservaData = {
        taxiId,
        userId,
        dataHora,
        origen,
        desti,
        distanciaKm: this.distanciaKm,
        preu: this.preuTotal
      };

      this.reservaTaxiService.createReserva(reservaData).subscribe({
        next: () => {
          this.resetForm()
          alert('Reserva de taxi realitzada amb èxit!');
        },
        error: (error) => {
          console.error('Error en la reserva', error);
          alert('Error al fer la reserva de taxi.');
        }
      });
    } else {
      alert('Completa tots els camps del formulari.');
    }
  }

  resetForm() {
    this.reservaForm.reset();
    this.reservaForm.get('taxiId')?.setValue(this.taxi?.id || '');

    this.preuTotal = 0;
    this.distanciaKm = 0;

    this.origenMarker?.setMap(null);
    this.destiMarker?.setMap(null);
    this.origenMarker = undefined!;
    this.destiMarker = undefined!;
  }

}
