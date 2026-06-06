import Phaser from 'phaser';
import { CROP_DEFS, CropDefinition } from '../data/CropData';
import { InventorySystem } from '../systems/InventorySystem';
import { GameState } from '../systems/GameState';

export class ShopScene extends Phaser.Scene {
  constructor() {
    super('ShopScene');
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 半透明背景
    const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.85);
    bg.setInteractive();

    // 标题
    this.add.text(width / 2, 60, '🏪 种子商店', {
      fontSize: '28px',
      color: '#ffd700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // 金币显示
    const gs = GameState.getInstance();
    const goldTxt = this.add.text(width / 2, 100, `💰 ${gs.playerData.gold}`, {
      fontSize: '18px',
      color: '#ffd700',
    }).setOrigin(0.5);

    // 滚动容器（简化版：固定列表）
    const items = Object.values(CROP_DEFS);
    const startY = 150;
    const lineH = 80;

    items.forEach((crop: CropDefinition, idx: number) => {
      const y = startY + idx * lineH;

      // 行背景
      const rowBg = this.add.rectangle(width / 2, y + 20, width - 40, 70, 0x1a3a0a, 0.9);
      rowBg.setInteractive({ useHandCursor: true });

      // 作物名
      this.add.text(60, y + 20, `${crop.emoji} ${crop.name}种子`, {
        fontSize: '18px',
        color: '#ffffff',
      }).setOrigin(0, 0.5);

      // 价格
      this.add.text(width - 120, y + 20, `🪙 ${crop.seedPrice}`, {
        fontSize: '16px',
        color: '#ffd700',
      }).setOrigin(0.5);

      // 售出价
      this.add.text(width - 50, y + 20, `💰 ${crop.sellPrice}`, {
        fontSize: '14px',
        color: '#aad68a',
      }).setOrigin(0, 0.5);

      // 购买按钮
      const buyBtn = this.add.text(width - 80, y + 20, '购买', {
        fontSize: '14px',
        color: '#fff',
        backgroundColor: '#4a8c2a',
        padding: { x: 8, y: 4 },
      }).setOrigin(0.5);
      buyBtn.setInteractive({ useHandCursor: true });

      buyBtn.on('pointerup', () => {
        this.buySeed(crop, goldTxt);
      });
    });

    // 关闭按钮
    this.createCloseBtn(width, height);
  }

  private buySeed(crop: CropDefinition, goldTxt: Phaser.GameObjects.Text): void {
    const gs = GameState.getInstance();
    if (gs.playerData.gold < crop.seedPrice) {
      this.showTip('金币不足！');
      return;
    }

    gs.playerData.gold -= crop.seedPrice;
    InventorySystem.getInstance().addItem(crop.id + '_seed', 1);

    goldTxt.setText(`💰 ${gs.playerData.gold}`);
    this.showTip(`购买了 ${crop.name}种子！`);
  }

  private createCloseBtn(width: number, height: number): void {
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

  private showTip(msg: string): void {
    const width = this.cameras.main.width;
    const tip = this.add.text(width / 2, 130, msg, {
      fontSize: '14px',
      color: '#fff',
      backgroundColor: '#000',
      padding: { x: 8, y: 4 },
      align: 'center',
    }).setOrigin(0.5);
    this.time.delayedCall(1200, () => tip.destroy());
  }
}
