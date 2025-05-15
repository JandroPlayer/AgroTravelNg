import { Component, OnInit } from '@angular/core';
import { Noticia, NoticiesService } from '../../services/noticia.service';
import { NgForOf, NgIf } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-noticies',
  imports: [
    NgIf,
    NgForOf,
    NavbarComponent
  ],
  templateUrl: './noticies.component.html'
})
export class NoticiesComponent implements OnInit {
  noticies: Noticia[] = [];
  carregant = false;
  paginaSize = 12;
  paginaActual = 1;
  totalResults = 0;

  constructor(private noticiesService: NoticiesService) {}

  ngOnInit() {
    this.carregarPagina(this.paginaActual);
  }

  carregarPagina(page: number) {
    this.carregant = true;
    this.noticiesService.getNoticies(page, this.paginaSize).subscribe(data => {
      this.noticies = data.articles ?? [];
      this.totalResults = data.totalResults;
      this.carregant = false;
    });
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.carregarPagina(this.paginaActual);
    }
  }

  paginaSeguent() {
    if (this.paginaActual < this.totalPagines) {
      this.paginaActual++;
      this.carregarPagina(this.paginaActual);
    }
  }

  get totalPagines(): number {
    return Math.ceil(this.totalResults / this.paginaSize);
  }

  // Devuelve las noticias ya paginadas (del backend)
  get noticiesPaginades(): Noticia[] {
    return this.noticies;
  }
}
