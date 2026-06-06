import Phaser from 'phaser';
import { InventorySystem } from '../systems/InventorySystem';
import { CROP_DEFS } from '../data/CropData';

export class InventoryScene extends Phaser.Scene {
  constructor() {
    super('InventoryScene');
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 半透明背景
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.85).setInteractive();

    // 标题
    this.add.text(width / 2, 60, '🎒 背包', {
      fontSize: '28px',
      color: '#ffd700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // 物品列表
    const inv = InventorySystem.getInstance();
    const items = inv.getAllItems();
    const startY = 130;
    const lineH = 60;

    if (items.length === 0) {
      this.add.text(width / 2, height / 2, '背包空空如也\n快去商店买种子吧！', {
        fontSize: '18px',
        color: '#aaa',
        align: 'center',
      }).setOrigin(0.5);
    } else {
      items.forEach((item, idx) => {
        const y = startY + idx * lineH;
        const def = CROP_DEFS[item.itemId.replace('_seed', '').replace('_harvest', '')];
        const emoji = def ? def.emoji : '📦';
        const name = def ? def.name : item.itemId;
        const type = item.itemId.includes('_seed') ? '种子' : item.itemId.includes('_harvest') ? '收获物' : '';

        this.add.text(60, y, `${emoji} ${name}${type}`, {
          fontSize: '16px',
          color: '#fff',
        });

        this.add.text(width - 80, y, `×${item.quantity}`, {
          fontSize: '16px',
          color: '#ffd700',
        }).setOrigin(1, 0);
      });
    }

    // 关闭按钮
    this.createCloseBtn(width, height);
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
}
