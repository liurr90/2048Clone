export type BoardState = number[][];
export type Position = { x: number; y: number };
export type Direction = 'left' | 'right' | 'up' | 'down';

/**
 * Manages the game state and logic for the 2048 game.
 * Handles board state, moves, scoring, and game rules.
 */
export class GameManager {
  private board: BoardState;
  private score: number;
  private readonly size: number;

  /**
   * Creates a new game manager with a board of the specified size.
   * Initializes an empty board and adds two starting tiles.
   * @param size - The size of the board (default: 4)
   */
  constructor(size: number = 4) {
    this.size = size;
    this.score = 0;
    this.board = this.initializeBoard();
  }

  /**
   * Returns the current state of the game board.
   * @returns A 2D array representing the current board state
   */
  getBoard(): BoardState {
    return this.board;
  }

  /**
   * Returns the current game score.
   * @returns The current score
   */
  getScore(): number {
    return this.score;
  }

  /**
   * Creates and initializes a new game board.
   * Creates an empty board of the specified size and adds two initial tiles.
   * @returns The initialized board state
   */
  private initializeBoard(): BoardState {
    const board = Array(this.size).fill(0).map(() => Array(this.size).fill(0));
    return this.addNewTile(this.addNewTile(board));
  }

  /**
   * Adds a new tile (2 or 4) to a random empty position on the board.
   * Has a 90% chance of adding a 2 and a 10% chance of adding a 4.
   * @param currentBoard - The current board state
   * @returns The new board state with the added tile
   */
  private addNewTile(currentBoard: BoardState): BoardState {
    const newBoard = [...currentBoard.map(row => [...row])];
    const emptyPositions: Position[] = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (newBoard[i][j] === 0) {
          emptyPositions.push({ x: i, y: j });
        }
      }
    }

    if (emptyPositions.length === 0) return newBoard;

    const { x, y } = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
    newBoard[x][y] = Math.random() < 0.9 ? 2 : 4;
    return newBoard;
  }

  /**
   * Processes a move in the specified direction.
   * Updates the board state and score if the move is valid.
   * @param direction - The direction to move ('left', 'right', 'up', 'down')
   * @returns Whether the move resulted in any changes to the board
   */
  move(direction: Direction): boolean {
    const [newBoard, newScore] = this.moveBoard(this.board, direction);
    const hasChanged = JSON.stringify(newBoard) !== JSON.stringify(this.board);
    
    if (hasChanged) {
      this.board = this.addNewTile(newBoard);
      this.score += newScore;
    }

    return hasChanged;
  }

  /**
   * Calculates the new board state after a move in the specified direction.
   * Handles tile merging and scoring according to 2048 game rules.
   * @param currentBoard - The current board state
   * @param direction - The direction to move tiles
   * @returns A tuple of [new board state, points scored in this move]
   */
  private moveBoard(currentBoard: BoardState, direction: Direction): [BoardState, number] {
    let newBoard = [...currentBoard.map(row => [...row])];
    let newScore = 0;

    /**
     * Helper function that moves all tiles in a row to the left,
     * merging identical adjacent tiles and calculating score.
     * @param row - The row to process
     * @returns A tuple of [new row state, points scored]
     */
    const moveLeft = (row: number[]): [number[], number] => {
      const newRow = row.filter(cell => cell !== 0);
      let score = 0;
      
      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          score += newRow[i];
          newRow.splice(i + 1, 1);
        }
      }
      
      while (newRow.length < this.size) {
        newRow.push(0);
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

  /**
   * Rotates the board 90 degrees clockwise or counterclockwise.
   * Used to transform vertical movements into horizontal ones.
   * @param board - The board state to rotate
   * @param counterClockwise - Whether to rotate counterclockwise (default: false)
   * @returns The rotated board state
   */
  private rotateBoard(board: BoardState, counterClockwise = false): BoardState {
    const rotated = Array(this.size).fill(0).map(() => Array(this.size).fill(0));
    
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (counterClockwise) {
          rotated[this.size - 1 - j][i] = board[i][j];
        } else {
          rotated[j][this.size - 1 - i] = board[i][j];
        }
      }
    }
    
    return rotated;
  }
} 