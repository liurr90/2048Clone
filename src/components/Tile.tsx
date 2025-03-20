import React from 'react';
import { StyleSheet, Text, Animated } from 'react-native';

interface TileProps {
  value: number;
  position: { x: number; y: number };
  isNew: boolean;
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

const Tile: React.FC<TileProps> = ({ value, position, isNew }) => {
  const [prevPosition, setPrevPosition] = React.useState(position);
  const animatedValue = React.useRef(new Animated.Value(value === 0 ? 0 : 1)).current;
  const animatedPosition = React.useRef(new Animated.ValueXY({ 
    x: position.x * 80, 
    y: position.y * 80 
  })).current;

  React.useEffect(() => {
    if (isNew) {
      // For new tiles, just set the position without animation
      animatedPosition.setValue({ 
        x: position.x * 80, 
        y: position.y * 80 
      });
      // Animate the scale from 0 to 1
      Animated.spring(animatedValue, {
        toValue: value === 0 ? 0 : 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      // For existing tiles, animate the position
      Animated.spring(animatedPosition, {
        toValue: { 
          x: position.x * 80, 
          y: position.y * 80 
        },
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }).start();
    }
    setPrevPosition(position);
  }, [position, value, isNew]);

  if (value === 0) return null;

  return (
    <Animated.View
      style={[
        styles.tile,
        {
          backgroundColor: getBackgroundColor(value),
          transform: [
            {
              translateX: animatedPosition.x,
            },
            {
              translateY: animatedPosition.y,
            },
            {
              scale: animatedValue,
            },
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

export default Tile; 