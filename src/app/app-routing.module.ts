import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelListComponent } from './components/hotel-list/hotel-list.component';
import { HotelDetailComponent } from './components/hotel-detail/hotel-detail.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import {AutobusesComponent} from './components/autobuses/autobuses.component';
import {TaxisComponent} from './components/taxis/taxis.component';
import {BusMapComponent} from './components/busmap/bus-map.component';
import {BookingListComponent} from './components/booking-list/booking-list.component';
import {ReservaAutobusComponent} from './components/reservautobus/reservautobus.component';
import {ActivitatsComponent} from './components/activitats/activitats.component';
import {FavoritosComponent} from './components/favoritos/favoritos.component';
import {GastronomiaComponent} from './components/gastronomia/gastronomia.component';
import {NoticiesComponent} from './components/noticies/noticies.component';
import {ReservaTaxiComponent} from './components/reserva-taxi/reservataxi.component';
import {AdminUsersComponent} from './components/admin-users/admin-users.component';
import {AdminReservesComponent} from './components/admin-reserves/admin-reserves.component';
import {AuthGuard} from './services/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'hotels', component: HotelListComponent },
  { path: 'hotel/:id', component: HotelDetailComponent, canActivate: [AuthGuard] },
  { path: 'users/:id', component: UserDetailComponent, canActivate: [AuthGuard] },
  { path: 'reservautobus/:id', component: ReservaAutobusComponent, canActivate: [AuthGuard] },
  { path: 'reservataxi/:id', component: ReservaTaxiComponent, canActivate: [AuthGuard] },
  { path: 'autobuses', component: AutobusesComponent },
  { path: 'taxis', component: TaxisComponent },
  { path: 'busmap', component: BusMapComponent, canActivate: [AuthGuard]},
  { path: 'activitats', component: ActivitatsComponent, canActivate: [AuthGuard] },
  { path: 'gastronomia', component: GastronomiaComponent },
  { path: 'noticias', component: NoticiesComponent },
  { path: 'admin/users', component: AdminUsersComponent, canActivate: [AuthGuard] },
  { path: 'admin/reserves', component: AdminReservesComponent, canActivate: [AuthGuard] },
  // Rutas dropdown
  { path: 'users/:id/favoritos', component: FavoritosComponent, canActivate: [AuthGuard] },
  { path: 'users/:id/bookings', component: BookingListComponent, canActivate: [AuthGuard] },

  { path: '', redirectTo: '/hotels', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

