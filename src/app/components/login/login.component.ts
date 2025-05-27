import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import {Logica} from '../../logica/logica';  // Importamos el UserService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [FormsModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = { email: '', password: '' };
  message = '';

  constructor(
    private router: Router,
    private userService: UserService,  // Inyectamos el UserService
    private logica: Logica
  ) {}

  login() {
    this.userService.login(this.user).subscribe({
      next: (usuariologin: any) => {
        console.log('Login exitoso:', usuariologin);
        this.message = 'Inicio de sesión exitoso';
        this.logica.showSnackBar(this.message, "success");

        // Guardamos el usuario en el servicio UserService
        this.userService.setUser(usuariologin);

        // Redirigimos a la página de hoteles sin pasar el usuario en los queryParams
        this.router.navigate(['/hotels']);
      },
      error: (err: any) => {
        console.error();
        const errorMessage = err.error?.message || err.error || 'Ocurrió un error inesperado';
        this.message = errorMessage;
        this.logica.showSnackBar(errorMessage, "error");
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}


