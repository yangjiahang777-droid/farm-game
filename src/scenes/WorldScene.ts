import Phaser from 'phaser';
import { FarmGrid } from '../systems/FarmGrid';
import { GameState } from '../systems/GameState';
import { InventorySystem } from '../systems/InventorySystem';

export class WorldScene extends Phaser.Scene {
  private farmGrid!: FarmGrid;
  private goldText!: Phaser.GameObjects.Text;
  private expText!: Phaser.GameObjects.Text;

  constructor() {
    super('WorldScene');
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 背景
    this.cameras.main.setBackgroundColor('#2d5a1b');

    // 标题
    this.add.text(width / 2, 50, 'FARM 🌾', {
      fontSize: '36px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // 状态文字（金币/等级/经验）
    this.createStatusBar(width);

    // 创建农场网格
    this.farmGrid = new FarmGrid(this);

    // 监听播种/收获 → 刷新状态栏
    this.farmGrid.onPlant(() => this.refreshStatusBar());
    this.farmGrid.onHarvest(() => this.refreshStatusBar());

    // 底部按钮栏
    this.createBottomBar(width, height);
  }

  private createStatusBar(width: number): void {
    const gs = GameState.getInstance();

    this.goldText = this.add.text(20, 80, `💰 ${gs.playerData.gold}`, {
      fontSize: '18px',
      color: '#ffd700',
      fontStyle: 'bold',
    });

    this.expText = this.add.text(width - 20, 80, `⭐ Lv.${gs.playerData.level}  EXP:${gs.playerData.exp}`, {
      fontSize: '16px',
      color: '#aad68a',
    }).setOrigin(1, 0);
  }

  private refreshStatusBar(): void {
    const gs = GameState.getInstance();
    this.goldText.setText(`💰 ${gs.playerData.gold}`);
    this.expText.setText(`⭐ Lv.${gs.playerData.level}  EXP:${gs.playerData.exp}`);
  }

  private createBottomBar(width: number, height: number): void {
    const btnSize = 56;
    const btnSpacing = 16;
    const buttons = [
      { label: '🏪\n商店', target: 'ShopScene' },
      { label: '🎒\n背包', target: 'InventoryScene' },
      { label: '📋\n任务', target: 'TaskScene' },
      { label: '⚙️\n设置', target: 'SettingsScene' },
    ];

    const totalW = buttons.length * (btnSize + btnSpacing) - btnSpacing;
    const startX = (width - totalW) / 2;
    const btnY = height - btnSize / 2 - 20;

    // 底部背景
    const barBg = this.add.graphics();
    barBg.fillStyle(0x000000, 0.6);
    barBg.fillRect(0, height - btnSize - 40, width, btnSize + 40);
    barBg.setScrollFactor(0);
    barBg.setDepth(999);

    buttons.forEach((btn, i) => {
      const x = startX + i * (btnSize + btnSpacing) + btnSize / 2;

      const bg = this.add.rectangle(x, btnY, btnSize, btnSize, 0x3a7d22, 0.9);
      bg.setScrollFactor(0);
      bg.setDepth(1000);
      bg.setInteractive({ useHandCursor: true });

      const txt = this.add.text(x, btnY, btn.label, {
        fontSize: '11px',
        color: '#fff',
        align: 'center',
      }).setOrigin(0.5);
      txt.setScrollFactor(0);
      txt.setDepth(1001);

      bg.on('pointerover', () => bg.setFillStyle(0x5aad32, 1));
      bg.on('pointerout', () => bg.setFillStyle(0x3a7d22, 0.9));
      bg.on('pointerup', () => {
        this.scene.pause();
        this.scene.launch(btn.target);
      });
    });
  }

  update(time: number, delta: number): void {
    if (this.farmGrid) {
      this.farmGrid.update(time, delta);
    }
  }
}
