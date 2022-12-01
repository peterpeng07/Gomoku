import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs';

export interface Game {
  id: string;
  player1: string;
  player2?: string;
  board: any[];
  current: boolean;
  winner?: string;
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
      }
    })
  }

  findOpenGame(): [string | undefined, string | undefined] {
    for (let game of this.games) {
      if (game.player2 === undefined) {
        console.log("found open game id: " + game.id);
        return [game.id, game.player1];
      }
    }
    return [undefined, undefined];
  }

  joinGame(id: string, name: string): void {
    this.gameDoc = this.gamesCollection.doc(id);
    this.gameDoc.update({ player2: name });
    this.pushBoard();
  }

  newGame(game: Game): void {
    console.log("creating new game...");
    this.gameDoc = this.gamesCollection.doc(game.id);
    this.gameDoc.set(game);
    this.pushBoard();
  }

  pushBoard(): void {
    if (this.gameDoc) {
      this.gameDoc.valueChanges().subscribe(res => {
        if (res) {
          this.game$.next(res);
        }
      })
    }
  }

  update(newBoard: any[], next: boolean): void {
    if (this.gameDoc) {
      this.gameDoc.update({ board: newBoard, current: next });
    }
  }

  win(name: string): void {
    if (this.gameDoc) {
      this.gameDoc.update({ winner: name });
    }
  }

  quit(player: boolean, opponent: string): void {
    if (this.gameDoc) {
      if (player) {
        this.gameDoc.update({ player1: '', winner: opponent });
      } else {
        this.gameDoc.update({ player2: '', winner: opponent });
      }

    }
  }
}
