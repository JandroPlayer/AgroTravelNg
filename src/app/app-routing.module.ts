import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelListComponent } from './components/hotel-list/hotel-list.component';
import { HotelDetailComponent } from './components/hotel-detail/hotel-detail.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import {BookingComponent} from './components/booking/booking.component';
import {AutobusesComponent} from './components/autobuses/autobuses.component';
import {TaxisComponent} from './components/taxis/taxis.component';
import {BusMapComponent} from './components/busmap/bus-map.component';
import {BookingListComponent} from './components/booking-list/booking-list.component';

export const routes: Routes = [
  { path: 'hotels', component: HotelListComponent },
  { path: 'hotel/:id', component: HotelDetailComponent },
  { path: 'users/:id', component: UserDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reserva', component: BookingComponent },
  { path: 'reserva/:id', component: BookingComponent },
  { path: 'autobuses', component: AutobusesComponent },
  { path: 'taxis', component: TaxisComponent },
  { path: 'busmap', component: BusMapComponent },
  {
    path: 'users/:id/bookings',
    component: BookingListComponent
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

