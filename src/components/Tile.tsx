import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, Animated } from 'react-native';

interface TileProps {
  value: number;
  position: { x: number; y: number };
  previousPosition?: { x: number; y: number } | null;
  isNew?: boolean;
}

const getBackgroundColor = (value: number): string => {
  const colors: { [key: number]: string } = {
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e',
  };
  return colors[value] || '#cdc1b4';
};

const getFontSize = (value: number): number => {
  if (value >= 1024) return 24;
  if (value >= 100) return 28;
  return 32;
};

const Tile: React.FC<TileProps> = ({ value, position, previousPosition, isNew = false }) => {
  const scale = useRef(new Animated.Value(isNew ? 0 : 1)).current;
  const left = useRef(new Animated.Value(
    previousPosition ? previousPosition.x * 80 : position.x * 80
  )).current;
  const top = useRef(new Animated.Value(
    previousPosition ? previousPosition.y * 80 : position.y * 80
  )).current;

  useEffect(() => {
    if (isNew) {
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }

    Animated.parallel([
      Animated.spring(left, {
        toValue: position.x * 80,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.spring(top, {
        toValue: position.y * 80,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [position, isNew]);

  if (value === 0) return null;

  return (
    <Animated.View
      style={[
        styles.tile,
        {
          backgroundColor: getBackgroundColor(value),
          transform: [
            { translateX: left },
            { translateY: top },
            { scale },
          ],
        },
      ]}
    >
      <Text
        style={[
          styles.tileText,
          {
            fontSize: getFontSize(value),
            color: value <= 4 ? '#776e65' : '#f9f6f2',
          },
        ]}
      >
        {value}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tile: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  tileText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default React.memo(Tile); 