import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface OpponentData {
  name: string
}

@Component({
  selector: 'app-joining-dialog',
  templateUrl: './joining-dialog.component.html',
  styleUrls: ['./joining-dialog.component.scss']
})
export class JoiningDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<JoiningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OpponentData,
  ) { }

}
