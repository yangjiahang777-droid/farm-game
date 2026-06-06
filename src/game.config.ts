import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, GAME_BACKGROUND_COLOR } from './utils/constants';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#' + GAME_BACKGROUND_COLOR.toString(16).padStart(6, '0'),
  parent: 'game-container',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    pixelArt: true,
    antialias: false,
  },
  fps: {
    target: 30,
    forceSetTimeOut: true,
  },
  scene: [],
};

export default gameConfig;
