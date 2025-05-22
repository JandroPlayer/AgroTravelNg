import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Autobus, VehiclesElectricsService } from '../../services/vehicleselectrics.service';
import { ReservaAutobusService } from '../../services/reservautobus.service';
import { UserService } from '../../services/user.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { NgIf, NgForOf, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {Logica} from '../../logica/logica';

@Component({
  selector: 'app-reserva-autobus',
  templateUrl: './reservautobus.component.html',
  styleUrls: ['./reservautobus.component.css'],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    MatFormField,
    MatInput,
    MatLabel,
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInput,
    MatNativeDateModule,
    NavbarComponent,
    MatSuffix,
    CurrencyPipe
  ]
})
export class ReservaAutobusComponent implements OnInit {
  autobus: Autobus | null = null;
  autobusos: Autobus[] = [];
  availableTimes: string[] = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  reservaForm: FormGroup;

  constructor(
    private vehiclesElectricsService: VehiclesElectricsService,
    private reservaAutobusService: ReservaAutobusService,
    private route: ActivatedRoute,
    private userService: UserService,
    private logica: Logica
  ) {
    this.reservaForm = new FormGroup({
      startDate: new FormControl(null, Validators.required),
      startTime: new FormControl('', Validators.required),
      numPassatgers: new FormControl(1, [Validators.required, Validators.min(1)]),
    });
  }

  ngOnInit(): void {
    const autobusId = Number(this.route.snapshot.paramMap.get('id'));
    this.vehiclesElectricsService.getAutobusos().subscribe((data) => {
      this.autobusos = data;
      this.autobus = this.autobusos.find(bus => bus.id === autobusId) || null;
    });
  }

  confirmarReserva(): void {
    if (this.reservaForm.valid && this.autobus) {
      const currentUser = this.userService.getUser();
      const userId = currentUser ? currentUser.id : 1;

      const startDate = this.reservaForm.get('startDate')?.value;
      const startTime = this.reservaForm.get('startTime')?.value;
      const numPassatgers = this.reservaForm.get('numPassatgers')?.value;

      const fechaReserva = `${startDate.toISOString().split('T')[0]}T${startTime}:00`;

      // Validar la cantidad de pasajeros con la capacidad del autobús
      if (numPassatgers > this.autobus.capacitatPassatgers) {
        this.logica.showSnackBar(`La cantidad de pasajeros no puede exceder la capacidad del autobús (${this.autobus.capacitatPassatgers})`, 'warning');
        return; // Si hay un error, salimos de la función
      }

      const preuTotal = this.autobus.preuPerPersona * numPassatgers;

      const reservaData = {
        autobusId: this.autobus.id,
        numPassatgers: numPassatgers,
        fechaReserva: fechaReserva,
        userId: userId,
        preu: preuTotal
      };

      this.reservaAutobusService.createReserva(reservaData).subscribe(
        (response) => {
          console.log('Reserva realizada', response);
          this.reservaForm.reset();
          this.logica.showSnackBar('Reserva realizada con éxito!', 'success');
        },
        (error) => {
          console.error('Error en la reserva', error);
          this.logica.showSnackBar('Error al realizar la reserva.', 'error');
        }
      );
    } else {
      this.logica.showSnackBar('Debes introducir todos los datos del formulario.', 'warning');
    }
  }

  get preuTotal(): number {
    const num = this.reservaForm.get('numPassatgers')?.value || 0;
    return this.autobus ? this.autobus.preuPerPersona * num : 0;
  }
}
