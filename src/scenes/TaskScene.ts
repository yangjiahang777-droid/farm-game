import Phaser from 'phaser';

export class TaskScene extends Phaser.Scene {
  constructor() {
    super('TaskScene');
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.85).setInteractive();

    this.add.text(width / 2, height / 2 - 40, '📋 任务系统', {
      fontSize: '28px',
      color: '#ffd700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 20, '开发中，敬请期待…', {
      fontSize: '16px',
      color: '#aaa',
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
