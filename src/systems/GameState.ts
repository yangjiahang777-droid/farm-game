export interface PlayerData {
  level: number;
  exp: number;
  gold: number;
  diamonds: number;
}

class GameState {
  private static instance: GameState;
  public playerData: PlayerData;

  private constructor() {
    this.playerData = {
      level: 1,
      exp: 0,
      gold: 100,
      diamonds: 10,
    };
  }

  public static getInstance(): GameState {
    if (!GameState.instance) {
      GameState.instance = new GameState();
    }
    return GameState.instance;
  }
}

export { GameState };
