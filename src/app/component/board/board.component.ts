import { Component, HostListener, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Game } from '../../services/game.service';
import { MatDialog } from '@angular/material/dialog';
import { StartingDialogComponent } from '../../dialog/starting-dialog/starting-dialog.component';
import { v4 as uuidv4 } from 'uuid';
import { WaitingDialogComponent } from '../../dialog/waiting-dialog/waiting-dialog.component';
import { JoiningDialogComponent } from '../block/joining-dialog/joining-dialog.component';
import { WinningDialogComponent } from '../../dialog/winning-dialog/winning-dialog.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  public playerName: string = '';
  public opponentName: string = '';
  public gameID: string = '';
  public playerTurn: boolean = true;

  public blocks: any[] = Array(225).fill(null);
  public xIsNext: boolean = true;
  public winner: string | null = null;
  public gameOver: boolean = false;

  private deleteReady: boolean = false;

  constructor(public dialog: MatDialog, private gameSvc: GameService) { }

  ngOnInit(): void {
    this.openStartingDialog();
  }

  openStartingDialog() {
    const dialogRef = this.dialog.open(StartingDialogComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      this.playerName = result;
      this.startGame(this.playerName);
      console.log(`Name entered: ${result}`);
    });
  }

  startGame(name: string): void {
    // look for open games
    const openGame = this.gameSvc.findOpenGame();
    if (openGame[0] && openGame[1]) {
      // join a game if there's one open
      console.log(`joining game: ${openGame}...`)
      const dialogRef = this.dialog.open(WaitingDialogComponent, {
        disableClose: true,
        data: {
          opponent: openGame[1],
          id: openGame[0]
        }
      });
      this.gameID = openGame[0];
      this.gameSvc.joinGame(openGame[0], this.playerName);
      this.playerTurn = false;
      this.opponentName = openGame[1];
    } else {
      // start new game
      this.gameID = uuidv4();
      const game: Game = {
        id: this.gameID,
        player1: name,
        board: Array(225).fill(null),
        current: true
      }
      this.gameSvc.newGame(game);
      this.playerTurn = true;
      const dialogRef = this.dialog.open(WaitingDialogComponent, {
        disableClose: true,
        data: {
          opponent: null,
          id: this.gameID
        }
      });
    }
    // subscribe to game changes
    this.gameSvc.game$.subscribe(res => {
      if (this.opponentName === '' && res.player2) {
        console.log(res.player2);

        this.opponentName = res.player2;
        this.dialog.open(JoiningDialogComponent, {
          disableClose: true,
          data: {
            name: res.player2
          }
        })
      }

      this.xIsNext = res.current;
      this.blocks = res.board;

      if (res.winner) {
        if (!this.winner) {
          this.winner = res.winner;
          this.gameOver = true;
          if (res.player1 === '' || res.player2 === '') {
            this.dialog.open(WinningDialogComponent, {
              data: {
                isWinner: res.winner === this.playerName,
                winner: this.winner,
                opponent: this.opponentName
              }
            })
          } else {
            this.dialog.open(WinningDialogComponent, {
              data: {
                isWinner: res.winner === this.playerName,
                winner: res.winner,
              }
            })
          }
        }
        if (res.player1 === '' || res.player2 === '') {
          this.deleteReady = true;
          console.log("ready to delete")
        }
      }
    })
  }

  get player() {
    return this.xIsNext ? 'Black' : 'White';
  }

  move(id: number) {
    if (!this.gameOver && this.blocks[id] === null && this.xIsNext === this.playerTurn) {
      this.blocks.splice(id, 1, this.xIsNext);
      this.calculateWinner();
      this.xIsNext = !this.xIsNext;
      this.gameSvc.update(this.blocks, this.xIsNext);
    }
  }

  calculateWinner(): void {
    // check for horizontal and vertical wins
    let p_h: boolean | null = null;
    let p_v: boolean | null = null;
    let count_h: number = 0;
    let count_v: number = 0;
    for (let i = 0; i < 15; i++) {
      p_h = null;
      p_v = null;
      count_h = 0;
      count_v = 0;
      for (let j = 0; j < 15; j++) {
        let i_h: number = i * 15 + j;
        let i_v: number = j * 15 + i;
        if (this.blocks[i_h] !== null) {
          if (this.blocks[i_h] === p_h) {
            count_h += 1;
          } else {
            p_h = this.blocks[i_h];
            count_h = 1;
          }
        } else {
          p_h = null;
          count_h = 0;
        }
        if (this.blocks[i_v] !== null) {
          if (this.blocks[i_v] === p_v) {
            count_v += 1;
          } else {
            p_v = this.blocks[i_v];
            count_v = 1;
          }
        } else {
          p_v = null;
          count_v = 0;
        }
        if (count_h === 5 || count_v === 5) {
          this.winGame();
        }
      }
    }
    // check for diagonal wins
    let p_r: boolean | null = null;
    let p_l: boolean | null = null;
    let p_dr: boolean | null = null;
    let p_dl: boolean | null = null;
    let count_r: number = 0;
    let count_l: number = 0;
    let count_dr: number = 0;
    let count_dl: number = 0;
    for (let i = 0; i < 11; i++) {
      p_r = null;
      p_l = null;
      p_dr = null;
      p_dl = null;
      count_r = 0;
      count_l = 0;
      count_dr = 0;
      count_dl = 0;
      for (let j = 0; j < (15 - i); j++) {
        let i_r: number = i + j * 16;
        let i_l: number = (14 - i) + j * 14;
        if (this.blocks[i_r] !== null) {
          if (this.blocks[i_r] === p_r) {
            count_r += 1;
          } else {
            p_r = this.blocks[i_r];
            count_r = 1;
          }
        } else {
          p_r = null;
          count_r = 0;
        }
        if (this.blocks[i_l] !== null) {
          if (this.blocks[i_l] === p_l) {
            count_l += 1;
          } else {
            p_l = this.blocks[i_l];
            count_l = 1;
          }
        } else {
          p_l = null;
          count_l = 0;
        }
        if (i > 0) {
          let i_dr = 15 * i + j * 16;
          let i_dl = (15 * (i + 1) - 1) + 14 * j;
          if (this.blocks[i_dr] !== null) {
            if (this.blocks[i_dr] === p_dr) {
              count_dr += 1;
            } else {
              p_dr = this.blocks[i_dr];
              count_dr = 1;
            }
          } else {
            p_dr = null;
            count_dr = 0;
          }
          if (this.blocks[i_dl] !== null) {
            if (this.blocks[i_dl] === p_dl) {
              count_dl += 1;
            } else {
              p_dl = this.blocks[i_dl];
              count_dl = 1;
            }
          } else {
            p_dl = null;
            count_dl = 0;
          }
        }
        if (count_l === 5 || count_r === 5 || count_dl === 5 || count_dr === 5) {
          this.winGame();
        }
      }
    }
  }

  winGame() {
    this.winner = this.playerName;
    this.gameOver = true;
    console.log(this.playerName + " wins!");
    this.gameSvc.win(this.playerName);
    this.dialog.open(WinningDialogComponent, {
      data: {
        isWinner: true,
        winner: this.winner
      }
    });
  }

  @HostListener('window:beforeunload')
  beforeUnloadHandler() {
    if (!this.gameOver) {
      this.gameSvc.quit(this.playerTurn, this.opponentName);
    } else {
      this.gameSvc.quit(this.playerTurn);
    }
    // this.gameSvc.game$.unsubscribe();
    // this.deleteReady ? this.gameSvc.deleteGame() : null;
    this.delete();
  }

  delete() {
    if (this.deleteReady) {
      this.gameSvc.deleteGame()
    } else {
      console.log("can't")
    }
  }
}

