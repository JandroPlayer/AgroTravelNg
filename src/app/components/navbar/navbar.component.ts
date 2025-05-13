import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: any;
  toggleMenu: boolean = false;
  toggleDropdown: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.user = this.userService.getUser();
  }

  logout() {
    this.userService.clearUser();
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  toggleMobileMenu() {
    this.toggleMenu = !this.toggleMenu;
  }

  toggleUserDropdown() {
    this.toggleDropdown = !this.toggleDropdown;
  }
}
