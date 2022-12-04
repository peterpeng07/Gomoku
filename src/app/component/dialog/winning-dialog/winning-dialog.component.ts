import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface winnerData {
  isWinner: boolean,
  winner: string,
  opponent?: string
}

@Component({
  selector: 'app-winning-dialog',
  templateUrl: './winning-dialog.component.html',
  styleUrls: ['./winning-dialog.component.scss']
})
export class WinningDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<WinningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: winnerData,
  ) { }


}
