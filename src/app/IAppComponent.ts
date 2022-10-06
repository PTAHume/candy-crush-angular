export default interface IAppComponent {
  createBoard(): void;
  ngOnInit(): void;
  CheckForColumnOfFour(): boolean;
  CheckForColumnOfThree(): boolean;
  CheckForRowOfFour(): boolean;
  CheckForRowOfThree(): boolean;
  MoveIntoSquareBelow(): boolean;
  DragStart(key: number): void;
  DragDrop(key: number): void;
  DragEnd(key: number): void;
  UpdateGame(): void;
}
