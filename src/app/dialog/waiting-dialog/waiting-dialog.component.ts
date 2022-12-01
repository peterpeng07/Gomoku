import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, DialogPosition } from '@angular/material/dialog';

interface WaitingData {
  opponent: string | null,
  id: string
}

@Component({
  selector: 'app-waiting-dialog',
  templateUrl: './waiting-dialog.component.html',
  styleUrls: ['./waiting-dialog.component.scss']
})
export class WaitingDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<WaitingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WaitingData,
  ) { }

}
