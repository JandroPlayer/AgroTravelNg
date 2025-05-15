import { Component, OnInit } from '@angular/core';
import {GastronomiaService, PlatTipic} from '../../services/gastronomia.service';
import {NavbarComponent} from '../navbar/navbar.component';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-gastronomia',
  templateUrl: './gastronomia.component.html',
  imports: [
    NavbarComponent,
    NgIf,
    NgForOf
  ]
})
export class GastronomiaComponent implements OnInit {
  plats: PlatTipic[] = [];
  carregant = true;

  constructor(private gastronomiaService: GastronomiaService) {}

  ngOnInit(): void {
    this.gastronomiaService.getPlats().subscribe({
      next: (dades) => {
        this.plats = dades;
        this.carregant = false;
      },
      error: (err) => {
        console.error('Error carregant plats típics:', err);
        this.carregant = false;
      }
    });
  }
}
