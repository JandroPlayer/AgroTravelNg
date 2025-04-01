// app-routing.module.ts (Configuració de rutes)
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelListComponent } from './hotel-list.component';
import { HotelDetailComponent } from './hotel-detail.component';

export const routes: Routes = [
  { path: 'hotels', component: HotelListComponent },
  { path: 'hotel/:id', component: HotelDetailComponent },  // Afegim la ruta per al detall de l'hotel
  { path: '', redirectTo: '/hotels', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
