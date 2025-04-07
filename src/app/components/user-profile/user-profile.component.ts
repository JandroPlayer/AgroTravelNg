import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userId: string = '';
  user: any = {};

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Obtener el ID del usuario de los parámetros de la ruta
    this.route.params.subscribe(params => {
      this.userId = params['id']; // 'id' es el parámetro de la ruta
      this.loadUserProfile();
    });
  }

  loadUserProfile() {
    // Llamar al UserService para obtener los datos del usuario
    this.userService.getUserById(this.userId).subscribe(userData => {
      this.user = userData;
      // Si no tiene imagen, asignamos una por defecto
      this.user.img = this.user.img || `https://ui-avatars.com/api/?name=${this.user.name}`;
    });
  }
}
