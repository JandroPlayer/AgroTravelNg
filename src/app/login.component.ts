import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = { email: '', password: '' };
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.user).subscribe({
      next: (res: string) => {
        console.log('Login exitoso:', res);  // Verifica si el login es exitoso
        this.message = res;
        this.goToHotels();
      },
      error: (err: { error: string; }) => {
        console.error('Error en login:', err);  // Verifica si hay algún error
        this.message = err.error;
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToHotels() {
    console.log('Redirigiendo a hoteles...');
    this.router.navigate(['/hotels']);
  }
}
