import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {AuthService} from '../../services/auth.service';
import { UserService } from '../../services/user.service'; // 👈 asegúrate de tenerlo
import { Location } from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  userId!: string;
  user: any = {
    name: '',
    email: '',
    img: ''
  };

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.getUserDetails();
  }

  getUserDetails(): void {
    this.userService.getUserById(this.userId).subscribe({
      next: (res) => this.user = res,
      error: (err) => console.error('Error cargando usuario', err)
    });
  }

  saveChanges(): void {
    this.userService.updateUser(this.userId, this.user).subscribe({
      next: () => alert('Dades actualitzades correctament.'),
      error: () => alert('Hi ha hagut un error actualitzant.')
    });
  }

  goBack(): void {
    this.location.back();
  }
}
