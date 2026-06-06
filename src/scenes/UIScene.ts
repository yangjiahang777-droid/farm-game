import Phaser from 'phaser';
import { GameState } from '../systems/GameState';

export class UIScene extends Phaser.Scene {
  private goldText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;

  constructor() {
    super('UIScene');
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 顶部状态栏背景
    const barBg = this.add.graphics();
    barBg.fillStyle(0x000000, 0.7);
    barBg.fillRect(0, 0, width, 50);
    barBg.setScrollFactor(0);
    barBg.setDepth(1000);

    // 金币显示
    const gs = GameState.getInstance();
    this.goldText = this.add.text(16, 25, `💰 ${gs.playerData.gold}`, {
      fontSize: '18px',
      color: '#ffd700',
      fontStyle: 'bold',
    });
    this.goldText.setOrigin(0, 0.5);
    this.goldText.setScrollFactor(0);
    this.goldText.setDepth(1001);

    // 等级显示
    this.levelText = this.add.text(width - 16, 25, `⭐ Lv.${gs.playerData.level}`, {
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    this.levelText.setOrigin(1, 0.5);
    this.levelText.setScrollFactor(0);
    this.levelText.setDepth(1001);

    // 底部按钮栏
    this.createBottomBar();
  }

  private createBottomBar(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const btnSize = 50;
    const btnSpacing = 12;
    const btnCount = 4;
    const totalWidth = btnCount * (btnSize + btnSpacing) - btnSpacing;
    const startX = (width - totalWidth) / 2;
    const btnY = height - btnSize / 2 - 10;

    // 背景条
    const barBg = this.add.graphics();
    barBg.fillStyle(0x000000, 0.7);
    barBg.fillRect(0, height - 70, width, 70);
    barBg.setScrollFactor(0);
    barBg.setDepth(1000);

    const buttons = [
      { key: 'shop', label: '🏪\n商店', scene: 'ShopScene' },
      { key: 'inventory', label: '🎒\n背包', scene: 'InventoryScene' },
      { key: 'task', label: '📋\n任务', scene: 'TaskScene' },
      { key: 'settings', label: '⚙️\n设置', scene: 'SettingsScene' },
    ];

    buttons.forEach((btn, index) => {
      const x = startX + index * (btnSize + btnSpacing) + btnSize / 2;

      const btnBg = this.add.rectangle(x, btnY, btnSize, btnSize, 0x444444, 0.8);
      btnBg.setScrollFactor(0);
      btnBg.setDepth(1001);
      btnBg.setInteractive({ useHandCursor: true });

      const btnText = this.add.text(x, btnY, btn.label, {
        fontSize: '10px',
        color: '#ffffff',
        align: 'center',
        fontStyle: 'bold',
      });
      btnText.setOrigin(0.5, 0.5);
      btnText.setScrollFactor(0);
      btnText.setDepth(1002);

      btnBg.on('pointerover', () => {
        btnBg.setFillStyle(0x666666, 0.9);
      });

      btnBg.on('pointerout', () => {
        btnBg.setFillStyle(0x444444, 0.8);
      });

      btnBg.on('pointerdown', () => {
        btnBg.setFillStyle(0x222222, 0.9);
      });

      btnBg.on('pointerup', () => {
        btnBg.setFillStyle(0x444444, 0.8);
        this.scene.pause('WorldScene');
        this.scene.start(btn.scene);
      });
    });
  }
}
