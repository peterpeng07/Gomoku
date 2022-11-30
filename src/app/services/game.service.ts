import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs';
// import firebase from 'firebase/compat/app';

export interface Game {
  player1: string;
  player2?: string;
  board: any[];
  current: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private gameDoc: AngularFirestoreDocument<Game>;
  public board: any[] = [];
  public game$ = new BehaviorSubject<Game>({ player1: '', player2: '', board: [], current: true });

  constructor(private db: AngularFirestore) {
    this.gameDoc = db.doc<Game>('/games/50Bai8fy6JihpRqyAwDF');
    this.gameDoc.valueChanges().subscribe(res => {
      if (res) {
        this.board = res.board;
        // console.log(res);
        this.game$.next(res);
      }
    })
  }

  update(game: Game): void {
    this.gameDoc.update(game);
  }
}
