import { GameState } from '../systems/GameState';
import { SaveSystem } from '../systems/SaveSystem';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    // 显示加载进度
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: '加载中...',
      style: { font: '20px monospace', color: '#ffffff' },
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2,
      text: '0%',
      style: { font: '18px monospace', color: '#e0e0e0' },
    });
    percentText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value: number) => {
      percentText.setText(Math.floor(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0x00ff00, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      loadingText.destroy();
      percentText.destroy();
      progressBar.destroy();
      progressBox.destroy();
    });
  }

  create(): void {
    // 初始化游戏状态
    GameState.getInstance();
    SaveSystem.getInstance();

    // 检查横屏
    this.checkOrientation();

    window.addEventListener('orientationchange', () => {
      this.checkOrientation();
    });

    // 直接跳转到游戏场景
    this.scene.start('WorldScene');
  }

  private checkOrientation(): void {
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
}
