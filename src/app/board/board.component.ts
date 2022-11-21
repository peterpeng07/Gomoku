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
  }
}
