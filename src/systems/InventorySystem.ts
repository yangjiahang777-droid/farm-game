import { SaveSystem } from './SaveSystem';

export interface InventoryItem {
  itemId: string;   // crop id 或工具 id
  quantity: number;
}

export class InventorySystem {
  private static instance: InventorySystem;
  private items: Map<string, number> = new Map(); // itemId -> quantity
  private listeners: (() => void)[] = [];

  private constructor() {
    this.load();
  }

  public static getInstance(): InventorySystem {
    if (!InventorySystem.instance) {
      InventorySystem.instance = new InventorySystem();
    }
    return InventorySystem.instance;
  }

  /** 增加物品（种子/收获物） */
  public addItem(itemId: string, qty: number = 1): void {
    const cur = this.items.get(itemId) ?? 0;
    this.items.set(itemId, cur + qty);
    this.save();
    this.notify();
  }

  /** 消耗物品，返回是否成功 */
  public consumeItem(itemId: string, qty: number = 1): boolean {
    const cur = this.items.get(itemId) ?? 0;
    if (cur < qty) return false;
    this.items.set(itemId, cur - qty);
    this.save();
    this.notify();
    return true;
  }

  /** 获取某物品数量 */
  public getQuantity(itemId: string): number {
    return this.items.get(itemId) ?? 0;
  }

  /** 获取所有物品 */
  public getAllItems(): InventoryItem[] {
    const result: InventoryItem[] = [];
    for (const [itemId, quantity] of this.items) {
      if (quantity > 0) result.push({ itemId, quantity });
    }
    return result;
  }

  /** 获取所有种子（用于商店和播种） */
  public getSeeds(): InventoryItem[] {
    return this.getAllItems().filter(i => i.itemId.endsWith('_seed'));
  }

  public onChange(listener: () => void): void {
    this.listeners.push(listener);
  }

  private notify(): void {
    this.listeners.forEach(fn => fn());
  }

  private save(): void {
    const data = Array.from(this.items.entries());
    SaveSystem.getInstance().save({ inventory: Object.fromEntries(this.items) });
  }

  private load(): void {
    const raw = SaveSystem.getInstance().load();
    if (raw && raw.inventory) {
      this.items = new Map(Object.entries(raw.inventory));
    }
  }
}
