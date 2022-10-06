import { Component, OnInit } from '@angular/core';
import IAppComponent from './IAppComponent';
const width: number = 8;
const candyColors: string[] = [
  '/assets/images/blue-candy.png',
  '/assets/images/green-candy.png',
  '/assets/images/orange-candy.png',
  '/assets/images/purple-candy.png',
  '/assets/images/red-candy.png',
  '/assets/images/yellow-candy.png',
];
const blank: string = '/assets/images/blank.png';
const notValidRowOfFourCheck: number[] = [
  5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54,
  55, 62, 63, 64,
];
const notValidRowOfThreeCheck: number[] = [
  6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64,
];
const firstRow: number[] = [0, 1, 2, 3, 4, 5, 6, 7];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, IAppComponent {
  score: number = 0;
  squareBeingDraggedId: number = 0;
  squareBeingReplacedId: number = 0;
  currentColorArrangement: string[] = [];

  createBoard = (): void => {
    for (let i: number = 0; i < width * width; i++) {
      const randomColor: string =
        candyColors[Math.floor(Math.random() * candyColors.length)];
      this.currentColorArrangement.push(randomColor);
    }
  };

  ngOnInit(): void {
    this.createBoard();
    this.UpdateGame();
  }

  CheckForColumnOfFour = (): boolean => {
    for (let i: number = 0; i <= 39; i++) {
      const columnOfFour: number[] = [
        i,
        i + width,
        i + width * 2,
        i + width * 3,
      ];
      console.log(columnOfFour);
      const decidedColor: string = this.currentColorArrangement[i];
      const isBlank: boolean = this.currentColorArrangement[i] === blank;
      if (
        columnOfFour.every(
          (square: number) =>
            this.currentColorArrangement[square] === decidedColor
        ) &&
        !isBlank
      ) {
        this.score += 4;
        columnOfFour.forEach(
          (square: number) => (this.currentColorArrangement[square] = blank)
        );
        return true;
      }
    }
    return false;
  };

  CheckForColumnOfThree = (): boolean => {
    for (let i: number = 0; i <= 47; i++) {
      const columnOfThree: number[] = [i, i + width, i + width * 2];
      const decidedColor: string = this.currentColorArrangement[i];
      const isBlank: boolean = this.currentColorArrangement[i] === blank;
      if (
        columnOfThree.every(
          (square: number) =>
            this.currentColorArrangement[square] === decidedColor
        ) &&
        !isBlank
      ) {
        this.score += 3;
        columnOfThree.forEach(
          (square: number) => (this.currentColorArrangement[square] = blank)
        );
        return true;
      }
    }
    return false;
  };

  CheckForRowOfFour = (): boolean => {
    for (let i: number = 0; i < 64; i++) {
      const rowOfFour: number[] = [i, i + 1, i + 2, i + 3];
      const decidedColor: string = this.currentColorArrangement[i];
      const isBlank: boolean = this.currentColorArrangement[i] === blank;
      if (notValidRowOfFourCheck.includes(i)) continue;
      if (
        rowOfFour.every(
          (square: number) =>
            this.currentColorArrangement[square] === decidedColor
        ) &&
        !isBlank
      ) {
        this.score += 4;
        rowOfFour.forEach(
          (square: number) => (this.currentColorArrangement[square] = blank)
        );
        return true;
      }
    }
    return false;
  };

  CheckForRowOfThree = (): boolean => {
    for (let i: number = 0; i < 64; i++) {
      const rowOfThree: number[] = [i, i + 1, i + 2];
      const decidedColor: string = this.currentColorArrangement[i];
      const isBlank: boolean = this.currentColorArrangement[i] === blank;
      if (notValidRowOfThreeCheck.includes(i)) continue;
      if (
        rowOfThree.every(
          (square: number) =>
            this.currentColorArrangement[square] === decidedColor
        ) &&
        !isBlank
      ) {
        this.score += 3;
        rowOfThree.forEach(
          (square: number) => (this.currentColorArrangement[square] = blank)
        );
        return true;
      }
    }
    return false;
  };

  MoveIntoSquareBelow = (): boolean => {
    let moveComplete: boolean = true;
    for (let i: number = 0; i <= 55; i++) {
      const isFirstRow: boolean = firstRow.includes(i);
      if (isFirstRow && this.currentColorArrangement[i] === blank) {
        const randomNumber: number = Math.floor(
          Math.random() * candyColors.length
        );
        this.currentColorArrangement[i] = candyColors[randomNumber];
        moveComplete = false;
      }
      if (this.currentColorArrangement[i + width] === blank) {
        this.currentColorArrangement[i + width] =
          this.currentColorArrangement[i];
        this.currentColorArrangement[i] = blank;
        moveComplete = false;
      }
    }
    return moveComplete;
  };

  DragStart = (key: number): void => {
    this.squareBeingDraggedId = key;
  };

  DragDrop = (key: number): void => {
    this.squareBeingReplacedId = key;
  };

  DragEnd = (key: number): void => {
    const validMoves = [
      this.squareBeingDraggedId - 1,
      this.squareBeingDraggedId - width,
      this.squareBeingDraggedId + 1,
      this.squareBeingDraggedId + width,
    ];

    const squareBeingReplaced =
      this.currentColorArrangement[this.squareBeingReplacedId];
    const squareBeingDragged =
      this.currentColorArrangement[this.squareBeingDraggedId];

    this.currentColorArrangement[this.squareBeingReplacedId] =
      squareBeingDragged;
    this.currentColorArrangement[this.squareBeingDraggedId] =
      squareBeingReplaced;

    const validMove = validMoves.includes(this.squareBeingReplacedId);

    if (
      this.squareBeingReplacedId &&
      validMove &&
      (this.CheckForColumnOfFour() ||
        this.CheckForRowOfFour() ||
        this.CheckForColumnOfThree() ||
        this.CheckForRowOfThree())
    ) {
      this.currentColorArrangement[this.squareBeingDraggedId] = blank;
      this.currentColorArrangement[this.squareBeingReplacedId] = blank;
      this.squareBeingDraggedId = 0;
      this.squareBeingReplacedId = 0;
      this.UpdateGame();
    } else {
      this.currentColorArrangement[this.squareBeingReplacedId] =
        squareBeingReplaced;
      this.currentColorArrangement[this.squareBeingDraggedId] =
        squareBeingDragged;
    }
  };

  UpdateGame = (): void => {
    const timer = setInterval(() => {
      this.CheckForColumnOfFour();
      this.CheckForRowOfFour();
      this.CheckForColumnOfThree();
      this.CheckForRowOfThree();
      if (this.MoveIntoSquareBelow() === false) {
        this.UpdateGame();
      } else {
        clearInterval(timer);
      }
    }, 160);
  };
}
