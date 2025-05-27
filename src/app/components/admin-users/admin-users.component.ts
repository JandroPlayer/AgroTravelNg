import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import {NavbarComponent} from '../navbar/navbar.component';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Logica} from '../../logica/logica';

@Component({
  selector: 'admin-users',
  templateUrl: './admin-users.component.html',
  imports: [
    NavbarComponent,
    NgIf,
    FormsModule,
    NgForOf
  ]
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  loading = false;
  error: string | null = null;
  currentUserId: number | null = null;

  // Para control del orden
  sortOrder: 'asc' | 'desc' = 'asc';
  sortField: string = 'id';

  constructor(
    private userService: UserService,
    private logica: Logica)
  {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;

    // Obtén usuario actual solo una vez
    const user = this.userService.getUser();
    this.currentUserId = user ? user.id : null;

    // Luego llama al servicio para cargar usuarios
    this.userService.getAllUsers().subscribe({
      next: data => {
        this.users = data;
        this.loading = false;
        console.log(this.users);
      },
      error: () => {
        this.error = 'Error al carregar usuaris';
        this.loading = false;
      }
    });
  }


  // Cambia el campo y ordena
  setSort(field: string) {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
  }

  // Devuelve el array ordenado según el campo y orden
  sortedUsers() {
    return this.users.slice().sort((a, b) => {
      let valA: any;
      let valB: any;

      if (this.sortField === 'id') {
        valA = a.id;
        valB = b.id;
      } else if (this.sortField === 'email') {
        valA = (a.email || '').toLowerCase();
        valB = (b.email || '').toLowerCase();
      } else {
        valA = (a.name || '').toLowerCase();
        valB = (b.name || '').toLowerCase();
      }

      if (valA < valB) return this.sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  saveUser(user: any): void {
    this.userService.updateUser(user.id.toString(), user).subscribe({
      next: () => {
        this.logica.showSnackBar('Dades actualitzades correctament.', "success");
        this.loadUsers();  // recarga usuarios si quieres
      },
      error: () => {
        this.logica.showSnackBar('Hi ha hagut un error actualitzant.', "error");
      }
    });
  }

  deleteUser(userId: number) {
    if (confirm('Segur que vols eliminar aquest usuari?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => this.loadUsers(),
        error: () => alert('Error eliminant usuari')
      });
    }
  }
}

