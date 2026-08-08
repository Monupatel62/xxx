export type GameState = "PLAYING" | "PAUSED";

export class GameStateManager {
  private state: GameState = "PLAYING";

  public setState(state: GameState): void {
    this.state = state;
  }

  public getState(): GameState {
    return this.state;
  }

  public isPlaying(): boolean {
    return this.state === "PLAYING";
  }

  public isPaused(): boolean {
    return this.state === "PAUSED";
  }

  public togglePause(): void {
    this.state = this.state === "PLAYING" ? "PAUSED" : "PLAYING";
  }
}
