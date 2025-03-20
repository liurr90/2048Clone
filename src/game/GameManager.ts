export type BoardState = number[][];
export type Position = { x: number; y: number };
export type Direction = 'left' | 'right' | 'up' | 'down';
export type TileData = {
  value: number;
  isNew: boolean;
};
export type BoardWithMetadata = TileData[][];

export class GameManager {
  private board: BoardWithMetadata;
  private score: number;
  private readonly size: number;

  constructor(size: number = 4) {
    this.size = size;
    this.score = 0;
    this.board = this.initializeBoard();
  }

  getBoard(): BoardWithMetadata {
    return this.board;
  }

  getScore(): number {
    return this.score;
  }

  private initializeBoard(): BoardWithMetadata {
    const board = Array(this.size).fill(0).map(() => 
      Array(this.size).fill(null).map(() => ({ value: 0, isNew: false }))
    );
    return this.addNewTile(this.addNewTile(board));
  }

  private addNewTile(currentBoard: BoardWithMetadata): BoardWithMetadata {
    const newBoard = [...currentBoard.map(row => [...row.map(tile => ({ ...tile, isNew: false }))])];
    const emptyPositions: Position[] = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (newBoard[i][j].value === 0) {
          emptyPositions.push({ x: i, y: j });
        }
      }
    }

    if (emptyPositions.length === 0) return newBoard;

    const { x, y } = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
    newBoard[x][y] = {
      value: Math.random() < 0.9 ? 2 : 4,
      isNew: true
    };
    return newBoard;
  }

  move(direction: Direction): boolean {
    const [newBoard, newScore] = this.moveBoard(this.board, direction);
    const hasChanged = JSON.stringify(this.getBoardValues(newBoard)) !== JSON.stringify(this.getBoardValues(this.board));
    
    if (hasChanged) {
      this.board = this.addNewTile(newBoard);
      this.score += newScore;
    }

    return hasChanged;
  }

  private getBoardValues(board: BoardWithMetadata): number[][] {
    return board.map(row => row.map(tile => tile.value));
  }

  private moveBoard(currentBoard: BoardWithMetadata, direction: Direction): [BoardWithMetadata, number] {
    let newBoard = [...currentBoard.map(row => [...row.map(tile => ({ ...tile, isNew: false }))])];
    let newScore = 0;

    const moveLeft = (row: TileData[]): [TileData[], number] => {
      const newRow = row.filter(tile => tile.value !== 0);
      let score = 0;
      
      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i].value === newRow[i + 1].value) {
          newRow[i] = { value: newRow[i].value * 2, isNew: false };
          score += newRow[i].value;
          newRow.splice(i + 1, 1);
        }
      }
      
      while (newRow.length < this.size) {
        newRow.push({ value: 0, isNew: false });
      }
      
      return [newRow, score];
    };

    if (direction === 'left') {
      for (let i = 0; i < this.size; i++) {
        const [newRow, score] = moveLeft(newBoard[i]);
        newBoard[i] = newRow;
        newScore += score;
      }
    } else if (direction === 'right') {
      for (let i = 0; i < this.size; i++) {
        const [newRow, score] = moveLeft(newBoard[i].reverse());
        newBoard[i] = newRow.reverse();
        newScore += score;
      }
    } else if (direction === 'up') {
      const rotated = this.rotateBoard(newBoard);
      for (let i = 0; i < this.size; i++) {
        const [newRow, score] = moveLeft(rotated[i].reverse());
        rotated[i] = newRow.reverse();
        newScore += score;
      }
      newBoard = this.rotateBoard(rotated, true);
    } else {
      const rotated = this.rotateBoard(newBoard);
      for (let i = 0; i < this.size; i++) {
        const [newRow, score] = moveLeft(rotated[i]);
        rotated[i] = newRow;
        newScore += score;
      }
      newBoard = this.rotateBoard(rotated, true);
    }

    return [newBoard, newScore];
  }

  private rotateBoard(board: BoardWithMetadata, counterClockwise = false): BoardWithMetadata {
    const rotated = Array(this.size).fill(0).map(() => 
      Array(this.size).fill(null).map(() => ({ value: 0, isNew: false }))
    );
    
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (counterClockwise) {
          rotated[this.size - 1 - j][i] = { ...board[i][j] };
        } else {
          rotated[j][this.size - 1 - i] = { ...board[i][j] };
        }
      }
    }
    
    return rotated;
  }
} 