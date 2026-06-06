import Phaser from 'phaser';
import { CROP_DEFS, CropDefinition } from '../data/CropData';
import { InventorySystem } from './InventorySystem';
import { GameState } from './GameState';

/** 单个格子的状态 */
export interface GridCell {
  cropId: string | null;   // 作物ID（有种子时为 crop id，无作物为 null）
  stage: number;            // 当前生长阶段 0=空 1~stages=生长中 stages+1=可收获
  plantedAt: number | 0;  // 播种时间戳 ms
}

export class FarmGrid {
  private scene: Phaser.Scene;
  private cols: number;
  private rows: number;
  private cellSize: number;
  private offsetX: number;
  private offsetY: number;

  private grid: GridCell[][] = [];
  private cellGraphics: Phaser.GameObjects.Rectangle[][] = [];
  private cellTexts: Phaser.GameObjects.Text[][] = [];

  private onPlantCallbacks: (() => void)[] = [];
  private onHarvestCallbacks: (() => void)[] = [];

  constructor(scene: Phaser.Scene, cols = 12, rows = 8, cellSize = 48) {
    this.scene = scene;
    this.cols = cols;
    this.rows = rows;
    this.cellSize = cellSize;

    // 居中偏移
    this.offsetX = (scene.cameras.main.width - cols * cellSize) / 2;
    this.offsetY = 100;

    this.initGrid();
    this.drawGrid();
  }

  private initGrid(): void {
    for (let r = 0; r < this.rows; r++) {
      this.grid[r] = [];
      this.cellGraphics[r] = [];
      this.cellTexts[r] = [];
      for (let c = 0; c < this.cols; c++) {
        this.grid[r][c] = { cropId: null, stage: 0, plantedAt: 0 };
      }
    }
  }

  private drawGrid(): void {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = this.offsetX + c * this.cellSize;
        const y = this.offsetY + r * this.cellSize;

        const rect = this.scene.add.rectangle(
          x + this.cellSize / 2,
          y + this.cellSize / 2,
          this.cellSize - 2,
          this.cellSize - 2,
          0x4a8c2a
        );
        rect.setStrokeStyle(1, 0x2d5a1b);
        rect.setInteractive({ useHandCursor: true });
        rect.setData('row', r);
        rect.setData('col', c);

        rect.on('pointerdown', () => {
          this.onCellClick(r, c);
        });

        this.cellGraphics[r][c] = rect;

        const txt = this.scene.add.text(x + this.cellSize / 2, y + this.cellSize / 2, '', {
          fontSize: '10px',
          color: '#000',
          align: 'center',
        }).setOrigin(0.5);
        this.cellTexts[r][c] = txt;
      }
    }
  }

  /** 点击格子 */
  private onCellClick(row: number, col: number): void {
    const cell = this.grid[row][col];

    if (cell.cropId === null) {
      // 空格子 → 播种（需要有种子）
      this.plantCrop(row, col);
    } else if (cell.stage > (this.getCropDef(cell.cropId)?.stages ?? 0)) {
      // 可收获
      this.harvestCrop(row, col);
    }
  }

  /** 播种 */
  private plantCrop(row: number, col: number): void {
    const inv = InventorySystem.getInstance();
    // 找第一个有种子的
    const seeds = inv.getSeeds();
    if (seeds.length === 0) {
      this.showTip('没有种子！\n先去商店购买');
      return;
    }

    // 优先用第一个种子
    const seed = seeds[0];
    const cropId = seed.itemId.replace('_seed', '');
    if (!inv.consumeItem(seed.itemId, 1)) {
      this.showTip('播种失败');
      return;
    }

    this.grid[row][col] = { cropId, stage: 1, plantedAt: Date.now() };
    this.updateCellVisual(row, col);
    this.notifyPlant();
  }

  /** 收获 */
  private harvestCrop(row: number, col: number): void {
    const cell = this.grid[row][col];
    if (!cell.cropId) return;

    const def = this.getCropDef(cell.cropId);
    if (!def) return;

    // 加入背包（收获物）
    const inv = InventorySystem.getInstance();
    inv.addItem(cell.cropId + '_harvest', 1);

    // 获得金币
    const gs = GameState.getInstance();
    gs.playerData.gold += def.sellPrice;
    // 经验
    gs.playerData.exp += 10;

    this.grid[row][col] = { cropId: null, stage: 0, plantedAt: 0 };
    this.updateCellVisual(row, col);
    this.notifyHarvest();

    this.showTip(`获得 ${def.name}！\n+${def.sellPrice}💰`);
  }

  /** 每帧调用，驱动作物生长 */
  public update(time: number, delta: number): void {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        if (cell.cropId === null || cell.stage === 0) continue;

        const def = this.getCropDef(cell.cropId);
        if (!def) continue;

        // 已成熟
        if (cell.stage > def.stages) continue;

        // 检查是否需要进入下一阶段
        const elapsed = Date.now() - cell.plantedAt;
        const targetStage = Math.min(
          Math.floor(elapsed / def.stageDuration) + 1,
          def.stages + 1 // +1 表示成熟可收获
        );

        if (targetStage !== cell.stage) {
          cell.stage = targetStage;
          this.updateCellVisual(r, c);
        }
      }
    }
  }

  private updateCellVisual(row: number, col: number): void {
    const cell = this.grid[row][col];
    const rect = this.cellGraphics[row][col];
    const txt = this.cellTexts[row][col];

    if (cell.cropId === null || cell.stage === 0) {
      rect.setFillStyle(0x4a8c2a);
      txt.setText('');
      return;
    }

    const def = this.getCropDef(cell.cropId);
    if (!def) return;

    if (cell.stage > def.stages) {
      // 成熟
      rect.setFillStyle(def.color, 0.7);
      txt.setText(def.emoji);
      txt.setFontSize('20px');
    } else {
      // 生长中
      rect.setFillStyle(0x6b8e3a);
      txt.setText(cell.stage.toString());
      txt.setFontSize('14px');
    }
  }

  private getCropDef(cropId: string): CropDefinition | undefined {
    return CROP_DEFS[cropId];
  }

  private showTip(msg: string): void {
    const width = this.scene.cameras.main.width;
    const tip = this.scene.add.text(width / 2, this.offsetY + this.rows * this.cellSize + 40, msg, {
      fontSize: '14px',
      color: '#fff',
      backgroundColor: '#000',
      padding: { x: 8, y: 4 },
      align: 'center',
    }).setOrigin(0.5);
    this.scene.time.delayedCall(1500, () => tip.destroy());
  }

  public onPlant(cb: () => void): void { this.onPlantCallbacks.push(cb); }
  public onHarvest(cb: () => void): void { this.onHarvestCallbacks.push(cb); }

  private notifyPlant(): void { this.onPlantCallbacks.forEach(fn => fn()); }
  private notifyHarvest(): void { this.onHarvestCallbacks.forEach(fn => fn()); }

  /** 获取所有格子（用于存档） */
  public getGridData(): GridCell[][] {
    return this.grid;
  }

  public getCellSize(): number { return this.cellSize; }
  public getOffsetY(): number { return this.offsetY; }
  public getRows(): number { return this.rows; }
  public getCols(): number { return this.cols; }
}
