import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';  // Importar MatSnackBarModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {BookingListComponent} from './components/booking-list/booking-list.component';  // Necesario para las animaciones

@NgModule({
  declarations: [

  ],
  imports: [
    BrowserModule,
    MatSnackBarModule,  // Agregar el módulo del snackbar
    BrowserAnimationsModule,
    AppComponent,
    BookingListComponent,

    // Requerido para las animaciones de Material
  ],
  providers: [],
})
export class AppModule { }
