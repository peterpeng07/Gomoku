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

  constructor() { }

  ngOnInit(): void {
    // this.newGame();
  }

  newGame(): void {
    this.blocks = Array(225).fill(null);
    this.winner = null;
    this.xIsNext = true;
  }

  get player() {
    return this.xIsNext ? 'Black' : 'White';
  }

  makeMove(id: number) {
    if (!this.blocks[id]) {
      this.blocks.splice(id, 1, this.player);
      this.xIsNext = !this.xIsNext;
    }

    this.calculateWinner();
  }

  calculateWinner(): void {

  }
}
