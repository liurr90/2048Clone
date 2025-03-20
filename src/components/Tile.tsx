import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Position } from '../game/GameManager';

interface TileProps {
  value: number;
  position: Position;
  isNew: boolean;
}

const TILE_SIZE = Math.min(76, (Dimensions.get('window').width - 40) / 4);
const TILE_MARGIN = Math.min(8, TILE_SIZE * 0.1);

const Tile: React.FC<TileProps> = ({ value, position, isNew }) => {
  if (value === 0) return null;

  const tileStyle = {
    ...styles.tile,
    backgroundColor: getTileColor(value),
    left: position.x * (TILE_SIZE + TILE_MARGIN * 2) + TILE_MARGIN,
    top: position.y * (TILE_SIZE + TILE_MARGIN * 2) + TILE_MARGIN,
  };

  const textStyle = {
    ...styles.text,
    color: value <= 4 ? '#776e65' : '#f9f6f2',
    fontSize: value > 100 ? 24 : 32,
    fontWeight: isNew ? ('bold' as const) : ('normal' as const),
  };

  return (
    <View style={tileStyle}>
      <Text style={textStyle}>{value}</Text>
    </View>
  );
};

const getTileColor = (value: number): string => {
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

const styles = StyleSheet.create({
  tile: {
    position: 'absolute',
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 32,
    textAlign: 'center',
  },
});

export default Tile; 