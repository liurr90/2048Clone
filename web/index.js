import { AppRegistry } from 'react-native';
import App from '../App';
import { name as appName } from '../app.json';

// Add keyboard support for web
const handleKeyPress = (event) => {
  const gameContainer = document.getElementById('root');
  if (!gameContainer) return;

  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault();
      gameContainer.dispatchEvent(new CustomEvent('swipe', { detail: { direction: 'up' } }));
      break;
    case 'ArrowDown':
      event.preventDefault();
      gameContainer.dispatchEvent(new CustomEvent('swipe', { detail: { direction: 'down' } }));
      break;
    case 'ArrowLeft':
      event.preventDefault();
      gameContainer.dispatchEvent(new CustomEvent('swipe', { detail: { direction: 'left' } }));
      break;
    case 'ArrowRight':
      event.preventDefault();
      gameContainer.dispatchEvent(new CustomEvent('swipe', { detail: { direction: 'right' } }));
      break;
    default:
      break;
  }
};

// Add keyboard event listener when the document is ready
document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('keydown', handleKeyPress);
});

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('root')
}); 