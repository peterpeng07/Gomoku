import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs';
// import firebase from 'firebase/compat/app';

export interface Game {
  id: string;
  player1: string;
  player2?: string;
  board: any[];
  current: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private gamesCollection: AngularFirestoreCollection<Game>;
  private gameDoc: AngularFirestoreDocument<Game> | undefined;
  public games: Game[] = [];
  public board: any[] = [];
  public game$ = new BehaviorSubject<Game>({ id: '', player1: '', player2: '', board: [], current: true });

  constructor(private db: AngularFirestore) {
    this.gamesCollection = db.collection<Game>('games');
    this.gamesCollection.valueChanges().subscribe(res => {
      if (res) {
        this.games = res;
        // console.log(this.games);
      }
    })

    // this.gameDoc = db.doc<Game>('/games/50Bai8fy6JihpRqyAwDF');
    // this.gameDoc.valueChanges().subscribe(res => {
    //   if (res) {
    //     this.board = res.board;
    //     // console.log(res);
    //     this.game$.next(res);
    //   }
    // })
  }

  findOpenGame(): string | undefined {
    for (let game of this.games) {
      if (game.player2 === undefined) {
        console.log("next open game id: " + game.id);
        return game.id
      }
    }
    return undefined
  }

  joinGame(id: string, name: string): void {
    this.gameDoc = this.gamesCollection.doc(id);
    this.gameDoc.update({ player2: name });
    this.gameDoc.valueChanges().subscribe(res => {
      if (res) {
        this.game$.next(res);
      }
    })
  }

  newGame(game: Game): void {
    this.gameDoc = this.gamesCollection.doc(game.id);
    this.gameDoc.set(game);
    this.gameDoc.valueChanges().subscribe(res => {
      if (res) {
        this.game$.next(res);
      }
    })
  }

  update(newBoard: any[], next: boolean): void {
    if (this.gameDoc) {
      // console.log(this.gameDoc.get());
      this.gameDoc.update({ board: newBoard, current: next });
    }
  }
}
