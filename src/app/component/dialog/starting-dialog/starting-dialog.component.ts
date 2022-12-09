import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-starting-dialog',
  templateUrl: './starting-dialog.component.html',
  styleUrls: ['./starting-dialog.component.scss']
})
export class StartingDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<StartingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public name: string,
  ) {
    const player = localStorage.getItem('playerName');
    if (player)
      this.name = player;
  }

  nameChange(): void {
    localStorage.setItem('playerName', this.name);
  }

}
