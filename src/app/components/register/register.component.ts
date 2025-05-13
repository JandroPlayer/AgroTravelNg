import {Component} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {firstValueFrom} from 'rxjs';
import {Logica} from '../../logica/logica';


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

  emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

  cloudName = 'dglxd4bqz';
  uploadPreset = 'paucasesnoves';

  constructor(
    private userService: UserService,
    private router: Router,
    private http: HttpClient,
    private logica: Logica
  ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  async register() {
    if (!this.user.name || !this.user.email || !this.user.password) {
      this.logica.showSnackBar('Por favor, completa todos los campos.', "error");
      return;
    }

    if (!this.emailPattern.test(this.user.email)) {
      this.logica.showSnackBar('Correo electrónico inválido.', "error");
      return;
    }

    if (!this.passwordPattern.test(this.user.password)) {
      this.logica.showSnackBar(
        'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.',
        "error"
      );
      return;
    }

    try {
      if (this.selectedFile) {
        this.user.img = await this.uploadImageToCloudinary(this.selectedFile);
      } else {
        const initials = this.user.name.trim().split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase();
        this.user.img = `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=128`;
      }

      // 🚨 DEBUG: Mostrar datos antes de enviar
      console.log('📦 Datos a enviar al backend:');
      console.log(JSON.stringify(this.user, null, 2));

      // Enviar al backend
      this.userService.register(this.user).subscribe({
        next: (res: any) => {
          console.log('✅ Respuesta del backend:', res);
          this.message = res.message;
          this.logica.showSnackBar(this.message, res.status);
          if (res.status === 'success') {
            setTimeout(() => this.goToLogin(), 3000);
          }
        },
        error: (err: any) => {
          console.error('❌ Error recibido del backend:', err);
          this.message = err.error?.message || err.error || 'Ocurrió un error inesperado';
          this.logica.showSnackBar(this.message, "error");
        }
      });
    } catch (uploadError) {
      console.error('❌ Error en el proceso de subida de imagen:', uploadError);
      this.logica.showSnackBar('Error al subir la imagen de perfil.', "error");
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

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
