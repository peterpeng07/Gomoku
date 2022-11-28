import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  public blocks: any[] = Array(225).fill(null);
  private xIsNext: boolean = true;
  public winner: string | null = null;
  public gameOver: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // this.newGame();
  }

  newGame(): void {
    this.blocks = Array(225).fill(null);
    this.winner = null;
    this.xIsNext = true;
    this.gameOver = false;
  }

  get player() {
    return this.xIsNext ? 'Black' : 'White';
  }

  move(id: number) {
    if (!this.gameOver && this.blocks[id] === null) {
      this.blocks.splice(id, 1, this.xIsNext);
      this.calculateWinner();
      this.xIsNext = !this.xIsNext;
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
          this.winner = this.player;
          this.gameOver = true;
          console.log(this.player + " wins!")
        }
      }
    }

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
          this.winner = this.player;
          this.gameOver = true;
          console.log(this.player + " wins!")
        }
      }
    }
  }
}
