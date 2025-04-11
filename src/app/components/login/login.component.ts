import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';  // Importamos el UserService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [FormsModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = { email: '', password: '' };
  message = '';
  isSuccess: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService  // Inyectamos el UserService
  ) {}

  login() {
    this.authService.login(this.user).subscribe({
      next: (res: any) => {
        console.log('Login exitoso:', res);
        this.message = 'Inicio de sesión exitoso';
        this.isSuccess = true;
        this.showSnackbar(this.message, this.isSuccess);

        // Guardamos el usuario en el servicio UserService
        this.userService.setUser(res);

        // Redirigimos a la página de hoteles sin pasar el usuario en los queryParams
        this.router.navigate(['/hotels']);
      },
      error: (err: any) => {
        console.error('Error en login:', err);
        const errorMessage = err.error?.message || err.error || 'Ocurrió un error inesperado';
        this.message = errorMessage;
        this.isSuccess = false;
        this.showSnackbar(errorMessage, this.isSuccess);
      }
    });
  }

  showSnackbar(message: string, isSuccess: boolean) {
    const snackType = isSuccess ? 'success' : 'error';
    this.snackBar.open(message, '', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: [snackType]
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}


