import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, PanResponder, PanResponderGestureState, Platform } from 'react-native';
import Tile from './Tile';
import { GameManager, Direction } from '../game/GameManager';

const SWIPE_THRESHOLD = 50;

const Board: React.FC = () => {
  const gameManager = useRef(new GameManager(4)).current;
  const [board, setBoard] = useState(() => gameManager.getBoard());
  const [score, setScore] = useState(0);

  const updateGameState = () => {
    setBoard(gameManager.getBoard());
    setScore(gameManager.getScore());
  };

  const handleMove = (direction: Direction) => {
    const moved = gameManager.move(direction);
    if (moved) {
      updateGameState();
    }
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, gestureState) => {
        const { dx, dy } = gestureState;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        if (Math.max(absDx, absDy) < SWIPE_THRESHOLD) return;

        let direction: Direction;
        if (absDx > absDy) {
          direction = dx > 0 ? 'right' : 'left';
        } else {
          direction = dy > 0 ? 'down' : 'up';
        }

        handleMove(direction);
      },
    })
  ).current;

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleKeyPress = (event: any) => {
      let direction: Direction | null = null;
      
      switch (event.key) {
        case 'ArrowLeft':
          direction = 'left';
          break;
        case 'ArrowRight':
          direction = 'right';
          break;
        case 'ArrowUp':
          direction = 'up';
          break;
        case 'ArrowDown':
          direction = 'down';
          break;
        default:
          return;
      }

      if (direction) {
        event.preventDefault();
        handleMove(direction);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

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