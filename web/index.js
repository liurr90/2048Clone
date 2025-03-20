import { AppRegistry } from 'react-native';
import App from '../App';

AppRegistry.registerComponent('Game2048', () => App);
AppRegistry.runApplication('Game2048', {
  initialProps: {},
  rootTag: document.getElementById('root'),
}); 