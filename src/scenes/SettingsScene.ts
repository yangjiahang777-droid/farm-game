import Phaser from 'phaser';

export class SettingsScene extends Phaser.Scene {
  constructor() {
    super('SettingsScene');
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.85).setInteractive();

    this.add.text(width / 2, 60, '⚙️ 设置', {
      fontSize: '28px',
      color: '#ffd700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2, '设置功能开发中…\n\n💡 当前版本可正常游玩\n🎮 支持触屏操作\n🔊 音效：开发中', {
      fontSize: '16px',
      color: '#ccc',
      align: 'center',
      lineSpacing: 8,
    }).setOrigin(0.5);

    // 关闭按钮
    const btn = this.add.text(width - 30, 30, '✕', {
      fontSize: '24px',
      color: '#fff',
      backgroundColor: '#aa2222',
      padding: { x: 8, y: 4 },
    }).setOrigin(0.5);
    btn.setInteractive({ useHandCursor: true });
    btn.on('pointerup', () => {
      this.scene.stop();
      this.scene.resume('WorldScene');
    });
  }
}
