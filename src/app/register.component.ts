import {Component} from '@angular/core';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar'; // Importar MatSnackBar
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [FormsModule],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = { name: '', email: '', password: '' };
  message = '';  // Variable para mostrar el mensaje de feedback
  isSuccess: boolean = false;  // Booleano para determinar si la operación fue exitosa o no

  // Expresión regular para validar correo electrónico
  emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  // Expresión regular para validar la contraseña (mínimo 8 caracteres, al menos una mayúscula y un número)
  passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  register() {
    // Validar que todos los campos estén completos
    if (!this.user.name || !this.user.email || !this.user.password) {
      this.showSnackbar('Por favor, completa todos los campos.', false);
      return;  // Detener la ejecución si falta algún campo
    }

    // Validar formato del correo electrónico
    if (!this.emailPattern.test(this.user.email)) {
      this.showSnackbar('Correo electrónico inválido.', false);
      return;  // Detener la ejecución si el correo no es válido
    }

    // Validar formato de la contraseña
    if (!this.passwordPattern.test(this.user.password)) {
      this.showSnackbar('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.', false);
      return;  // Detener la ejecución si la contraseña no es válida
    }

    // Si todas las validaciones pasan, hacer la solicitud de registro
    this.authService.register(this.user).subscribe({
      next: (res: string) => {
        this.message = 'Usuario registrado con éxito!';
        this.isSuccess = true;  // Si la respuesta es exitosa, setea isSuccess a true
        this.showSnackbar(this.message, this.isSuccess);  // Muestra el snackbar con el mensaje de éxito
        setTimeout(() => {
          this.router.navigate(['/login']);  // Redirige a login después de 3 segundos
        }, 3000);
      },
      error: (err: any) => {
        console.error('Error en registro:', err);

        // Acceder correctamente al mensaje de error
        this.message = err.error?.message || err.error || 'Ocurrió un error inesperado';
        this.isSuccess = false;  // Si hay un error, setea isSuccess a false
        this.showSnackbar(this.message, this.isSuccess);  // Muestra el snackbar con el mensaje de error
      }
    });
  }

  // Metodo para mostrar el snackbar
  showSnackbar(message: string, isSuccess: boolean) {
    const snackType = isSuccess ? 'success' : 'error';  // Decide el tipo de snackbar dependiendo de isSuccess

    this.snackBar.open(message, '', {
      duration: 3000,  // Duración del snackbar
      verticalPosition: 'top',  // Posición del snackbar en la parte superior
      panelClass: [snackType]  // Asigna clases CSS según el tipo (verde o rojo)
    });
  }

  // Metodo para redirigir al login
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
