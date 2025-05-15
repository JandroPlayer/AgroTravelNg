import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface PlatTipic {
  id?: number;
  nom: string;
  descripcio: string;
  imatge: string;
}

@Injectable({ providedIn: 'root' })
export class GastronomiaService {
  private baseUrl = 'http://localhost:8080/api/plats';

  constructor(private http: HttpClient) {}

  getPlats(): Observable<PlatTipic[]> {
    return this.http.get<PlatTipic[]>(this.baseUrl);
  }

  afegirPlat(plat: PlatTipic): Observable<PlatTipic> {
    return this.http.post<PlatTipic>(this.baseUrl, plat);
  }
}
