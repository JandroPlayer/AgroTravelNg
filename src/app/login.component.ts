import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';  // Importar MatSnackBar

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = { email: '', password: '' };
  message = '';
  isSuccess: boolean = false;  // Booleano para determinar si el login fue exitoso o no

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  login() {
    this.authService.login(this.user).subscribe({
      next: (res: string) => {
        console.log('Login exitoso:', res);
        this.message = res;
        this.isSuccess = true;  // Si la respuesta es exitosa, setea isSuccess a true
        this.showSnackbar('Inicio de sesión exitoso', this.isSuccess);
        this.goToHotels();
      },
      error: (err: any) => {
        console.error('Error en login:', err);

        // Verifica si la propiedad 'error' contiene el mensaje de error
        const errorMessage = err.error?.message || err.error || 'Ocurrió un error inesperado';

        this.message = errorMessage;
        this.isSuccess = false;  // Si hay un error, setea isSuccess a false
        this.showSnackbar(errorMessage, this.isSuccess);
      }
    });
  }

  // Metodo para mostrar el snackbar
  showSnackbar(message: string, isSuccess: boolean) {
    const snackType = isSuccess ? 'success' : 'error';  // Decide el tipo de snackbar basado en el valor de isSuccess

    this.snackBar.open(message, '', {
      duration: 3000,  // Duración del snackbar en milisegundos
      verticalPosition: "top",  // Posiciona el snackbar en la parte superior
      panelClass: [snackType]  // Añadir clases CSS para cambiar el color dependiendo del tipo
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
