import React, { useState, useEffect } from 'react';
import { StyleSheet, View, PanResponder, PanResponderGestureState } from 'react-native';
import Tile from './Tile';

type BoardState = number[][];
type Position = { x: number; y: number };

const BOARD_SIZE = 4;
const SWIPE_THRESHOLD = 50;

const Board: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(() => initializeBoard());
  const [score, setScore] = useState(0);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, gestureState) => handleSwipe(gestureState),
    })
  ).current;

  function initializeBoard(): BoardState {
    const board = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));
    return addNewTile(addNewTile(board));
  }

  function addNewTile(currentBoard: BoardState): BoardState {
    const newBoard = [...currentBoard.map(row => [...row])];
    const emptyPositions: Position[] = [];

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
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

  function handleSwipe(gestureState: PanResponderGestureState) {
    const { dx, dy } = gestureState;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) < SWIPE_THRESHOLD) return;

    let direction: 'left' | 'right' | 'up' | 'down';
    if (absDx > absDy) {
      direction = dx > 0 ? 'right' : 'left';
    } else {
      direction = dy > 0 ? 'down' : 'up';
    }

    const [newBoard, newScore] = moveBoard(board, direction);
    if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
      setBoard(addNewTile(newBoard));
      setScore(score + newScore);
    }
  }

  function moveBoard(
    currentBoard: BoardState,
    direction: 'left' | 'right' | 'up' | 'down'
  ): [BoardState, number] {
    let newBoard = [...currentBoard.map(row => [...row])];
    let newScore = 0;

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
      
      while (newRow.length < BOARD_SIZE) {
        newRow.push(0);
      }
      
      return [newRow, score];
    };

    if (direction === 'left') {
      for (let i = 0; i < BOARD_SIZE; i++) {
        const [newRow, score] = moveLeft(newBoard[i]);
        newBoard[i] = newRow;
        newScore += score;
      }
    } else if (direction === 'right') {
      for (let i = 0; i < BOARD_SIZE; i++) {
        const [newRow, score] = moveLeft(newBoard[i].reverse());
        newBoard[i] = newRow.reverse();
        newScore += score;
      }
    } else if (direction === 'up') {
      const rotated = rotateBoard(newBoard);
      for (let i = 0; i < BOARD_SIZE; i++) {
        const [newRow, score] = moveLeft(rotated[i]);
        rotated[i] = newRow;
        newScore += score;
      }
      newBoard = rotateBoard(rotated, true);
    } else {
      const rotated = rotateBoard(newBoard);
      for (let i = 0; i < BOARD_SIZE; i++) {
        const [newRow, score] = moveLeft(rotated[i].reverse());
        rotated[i] = newRow.reverse();
        newScore += score;
      }
      newBoard = rotateBoard(rotated, true);
    }

    return [newBoard, newScore];
  }

  function rotateBoard(board: BoardState, counterClockwise = false): BoardState {
    const rotated = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));
    
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (counterClockwise) {
          rotated[BOARD_SIZE - 1 - j][i] = board[i][j];
        } else {
          rotated[j][BOARD_SIZE - 1 - i] = board[i][j];
        }
      }
    }
    
    return rotated;
  }

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.board}>
        {board.map((row, i) =>
          row.map((value, j) => (
            <Tile
              key={`${i}-${j}`}
              value={value}
              position={{ x: j, y: i }}
            />
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  board: {
    width: 320,
    height: 320,
    backgroundColor: '#bbada0',
    borderRadius: 8,
    padding: 4,
  },
});

export default Board; 