import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class Logica {
  constructor(private snackBar: MatSnackBar) {}

  showSnackBar(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    this.snackBar.open(message, '', {
      duration: type === 'info' ? undefined : 3000, // El snackbar d'informació no desapareix automàticament
      verticalPosition: 'top',
      panelClass: [type] // Utilitza les classes de CSS corresponents a cada tipus
    });
  }

}
