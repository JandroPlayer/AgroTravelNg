import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';  // Importar Router para redirección
import { FormsModule } from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [FormsModule, NgIf],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = { name: '', email: '', password: '' };
  message = '';  // Variable para mostrar el mensaje de feedback

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.user).subscribe({
      next: (res: string) => {
        this.message = 'Usuario registrado con éxito!';  // Mensaje de éxito
        setTimeout(() => {
          this.router.navigate(['/login']);  // Redirigir a login después de unos segundos
        }, 3000);  // 3 segundos para dar tiempo a ver el mensaje
      },
      error: (err: { error: string; }) => {
        this.message = err.error;  // Mostrar el error si hay alguno
      }
    });
  }

  // Método para redirigir al login
  goToLogin() {
    this.router.navigate(['/login']);
  }
}

