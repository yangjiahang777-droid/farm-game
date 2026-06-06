/**
 * 作物定义数据表（JSON 驱动）
 * 每种作物：id / 名称 / 各生长阶段时长(ms) / 售价 / 种子价格
 */
export interface CropDefinition {
  id: string;
  name: string;
  emoji: string;
  seedPrice: number;    // 金币
  sellPrice: number;     // 金币
  stages: number;       // 生长阶段数（含种子=0, 成熟=stages）
  stageDuration: number; // 每阶段时长 ms
  color: number;        // Phaser 颜色
}

export const CROP_DEFS: Record<string, CropDefinition> = {
  carrot: {
    id: 'carrot',
    name: '胡萝卜',
    emoji: '🥕',
    seedPrice: 10,
    sellPrice: 25,
    stages: 4,
    stageDuration: 8000, // 8秒每阶段（测试用，正式可改长）
    color: 0xff8c00,
  },
  tomato: {
    id: 'tomato',
    name: '番茄',
    emoji: '🍅',
    seedPrice: 15,
    sellPrice: 40,
    stages: 5,
    stageDuration: 10000,
    color: 0xff4500,
  },
  corn: {
    id: 'corn',
    name: '玉米',
    emoji: '🌽',
    seedPrice: 20,
    sellPrice: 55,
    stages: 5,
    stageDuration: 12000,
    color: 0xffd700,
  },
  eggplant: {
    id: 'eggplant',
    name: '茄子',
    emoji: '🍆',
    seedPrice: 12,
    sellPrice: 30,
    stages: 4,
    stageDuration: 9000,
    color: 0x800080,
  },
};

/** 获取所有作物 ID 列表 */
export function getCropIds(): string[] {
  return Object.keys(CROP_DEFS);
}
