import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ApiResponse {
  status: string;
  totalResults: number;
  articles: Noticia[];
}

export interface Noticia {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt?: string;
  source?: { id?: string; name: string };
  author?: string;
}

@Injectable({ providedIn: 'root' })
export class NoticiesService {
  private baseUrl = 'http://localhost:8080/api/noticies';

  constructor(private http: HttpClient) {}

  // noticia.service.ts (simplificado)
  getNoticies(page: number, pageSize: number) {
    const url = `${this.baseUrl}?page=${page}&pageSize=${pageSize}`;
    return this.http.get<ApiResponse>(url);
  }
}
