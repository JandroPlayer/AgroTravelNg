import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AutobusosService, Autobus } from '../../services/autobusos.service';
import { ReservaAutobusService } from '../../services/reservautobus.service';
import { UserService } from '../../services/user.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { NgIf, NgForOf } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-reserva-autobus',
  templateUrl: './reservautobus.component.html',
  styleUrls: ['./reservautobus.component.css'],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule, // Afegir ReactiveFormsModule aquí
    NgForOf,
    MatFormField,
    MatInput,
    MatLabel,
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInput,
    MatNativeDateModule,
    MatOption,
    MatSelect,
    NavbarComponent,
    MatSuffix
  ]
})
export class ReservaAutobusComponent implements OnInit {
  autobus: Autobus | null = null;
  autobusos: Autobus[] = [];
  availableTimes: string[] = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];
  missatge: string | null = null;

  // Formulari reactiu
  reservaForm: FormGroup;

  constructor(
    private autobusosService: AutobusosService,
    private reservaAutobusService: ReservaAutobusService,
    private route: ActivatedRoute,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    // Inicialitzar el formulari reactiu
    this.reservaForm = new FormGroup({
      startDate: new FormControl(null, Validators.required),
      startTime: new FormControl('', Validators.required),
      numPassatgers: new FormControl(1, [Validators.required, Validators.min(1)])
    });
  }

  ngOnInit(): void {
    const autobusId = Number(this.route.snapshot.paramMap.get('id'));
    this.autobusosService.getAutobusos().subscribe((data) => {
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

      const reservaData = {
        autobusId: this.autobus.id,
        numPassatgers: numPassatgers,
        fechaReserva: fechaReserva,
        userId: userId
      };

      this.reservaAutobusService.createReserva(reservaData).subscribe(
        (response) => {
          console.log('Reserva realitzada', response);
          this.reservaForm.reset();
          this.snackBar.open('Reserva realitzada amb èxit!', 'Tancar', {
            duration: 3000,
            panelClass: ['success']
          });
        },
        (error) => {
          console.error('Error en la reserva', error);
          this.snackBar.open('Error al fer la reserva.', 'Tancar', {
            duration: 3000,
            panelClass: ['error']
          });
        }
      );
    } else {
      this.snackBar.open('Has d’introduir totes les dades del formulari.', 'Tancar', {
        duration: 3000,
        panelClass: ['warning']
      });
    }
  }
}
