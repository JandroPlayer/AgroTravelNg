import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class Logica {
  constructor(private snackBar: MatSnackBar) {}

  showSnackBar(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success'): void {
    this.snackBar.open(message, '', {
      duration: type === 'info' ? undefined : 3000,
      verticalPosition: 'top',
      panelClass: [type]
    });
  }

}
