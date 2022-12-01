import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './component/board/board.component';
import { BlockComponent } from './component/block/block.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { StartingDialogComponent } from './dialog/starting-dialog/starting-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { WaitingDialogComponent } from './dialog/waiting-dialog/waiting-dialog.component';
import { JoiningDialogComponent } from './component/block/joining-dialog/joining-dialog.component';
import { WinningDialogComponent } from './dialog/winning-dialog/winning-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    BlockComponent,
    StartingDialogComponent,
    WaitingDialogComponent,
    JoiningDialogComponent,
    WinningDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
