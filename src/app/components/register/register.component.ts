import {Component} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {firstValueFrom} from 'rxjs';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: any = { name: '', email: '', password: '', img: '' };
  selectedFile: File | null = null;
  message = '';
  isSuccess: boolean = false;

  emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

  cloudName = 'dglxd4bqz';
  uploadPreset = 'paucasesnoves';

  constructor(
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  async register() {
    if (!this.user.name || !this.user.email || !this.user.password) {
      this.showSnackbar('Por favor, completa todos los campos.', false);
      return;
    }

    if (!this.emailPattern.test(this.user.email)) {
      this.showSnackbar('Correo electrónico inválido.', false);
      return;
    }

    if (!this.passwordPattern.test(this.user.password)) {
      this.showSnackbar('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.', false);
      return;
    }

    try {
      // Subir imagen si se ha seleccionado una
      if (this.selectedFile) {
        this.user.img = await this.uploadImageToCloudinary(this.selectedFile);
      } else {
        // Si no hay imagen, usar avatar generado
        const initials = this.user.name.trim().split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase();

        this.user.img = `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=128`;
      }

      // Metodo para registrar usuario
      this.userService.register(this.user).subscribe({
        next: () => {
          this.message = 'Usuario registrado con éxito!';
          this.isSuccess = true;
          this.showSnackbar(this.message, this.isSuccess);
          setTimeout(() => this.goToLogin(), 3000);
        },
        error: (err: any) => {
          this.message = err.error?.message || err.error || 'Ocurrió un error inesperado';
          this.isSuccess = false;
          this.showSnackbar(this.message, this.isSuccess);
        }
      });
    } catch (uploadError) {
      this.showSnackbar('Error al subir la imagen de perfil.', false);
    }
  }

  async uploadImageToCloudinary(file: File): Promise<string> {
    // Obtener la firma y el timestamp del backend
    const {timestamp, signature, apiKey} = await this.getCloudinarySignature();

    // Crear el FormData con la imagen y los parámetros necesarios
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset); // Aquí añadimos el upload_preset
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

    try {
      // Usar `toPromise()` para hacer la llamada (aunque `toPromise()` está deprecado)
      const res: any = await this.http.post(cloudinaryUrl, formData).toPromise();

      // Comprobar la respuesta de Cloudinary
      if (res && res.secure_url) {
        return res.secure_url; // Regresa la URL segura de la imagen
      } else {
        throw new Error('No se recibió una URL segura de Cloudinary');
      }

    } catch (err) {
      console.error('Error al subir la imagen de perfil:', err);
      throw new Error('Error al subir la imagen de perfil');
    }
  }


  async getCloudinarySignature(): Promise<any> {
    return await firstValueFrom(
      this.http.get('http://localhost:3000/api/cloudinary-signature')
    );
  }

  showSnackbar(message: string, isSuccess: boolean) {
    const snackType = isSuccess ? 'success' : 'error';
    this.snackBar.open(message, '', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: [snackType]
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
