import Phaser from 'phaser';
import { gameConfig } from './game.config';
import { BootScene } from './scenes/BootScene';
import { WorldScene } from './scenes/WorldScene';
import { ShopScene } from './scenes/ShopScene';
import { InventoryScene } from './scenes/InventoryScene';
import { TaskScene } from './scenes/TaskScene';
import { SettingsScene } from './scenes/SettingsScene';

async function initGame() {
  const config = {
    ...gameConfig,
    scene: [
      BootScene,
      WorldScene,
      ShopScene,
      InventoryScene,
      TaskScene,
      SettingsScene,
    ],
  };

  const game = new Phaser.Game(config);
  console.log('[FARM] 游戏初始化完成，场景已注册：', config.scene.map(s => s.name));
}

// 横屏检测
function checkOrientation() {
  const warning = document.getElementById('orientation-warning');
  const container = document.getElementById('game-container');
  if (!warning || !container) return;

  if (window.innerHeight > window.innerWidth) {
    warning.style.display = 'flex';
    container.style.display = 'none';
  } else {
    warning.style.display = 'none';
    container.style.display = 'block';
  }
}

window.addEventListener('orientationchange', checkOrientation);
window.addEventListener('load', () => {
  checkOrientation();
  initGame();
});
