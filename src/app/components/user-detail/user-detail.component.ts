import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Location } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NavbarComponent} from "../navbar/navbar.component";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
    imports: [
        FormsModule,
        NavbarComponent
    ],
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  userId!: string;
  user: any = {
    name: '',
    email: '',
    img: '',
    saldo: 0
  };

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.getUserDetails();
  }

  getUserDetails(): void {
    this.userService.getUserById(this.userId).subscribe({
      next: (res) => this.user = res,
      error: (err) => console.error()
    });
  }

  saveChanges(): void {
    this.userService.updateUser(this.userId, this.user).subscribe({
      next: () => {
        // Mostrar snackbar de éxito
        this.showSnackbar('Dades actualitzades correctament.', true);
      },
      error: () => {
        // Mostrar snackbar de error
        this.showSnackbar('Hi ha hagut un error actualitzant.', false);
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

  goBack(): void {
    this.location.back();
  }
}
