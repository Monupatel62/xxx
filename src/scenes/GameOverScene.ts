import { Scene } from "../engine/Scene";
import { Renderer } from "../engine/Renderer";
import { Input } from "../engine/Input";
import { EventBus } from "../engine/EventBus";
import { SoundManager } from "../managers/SoundManager";
import { EVT_GAME_OVER, GameResult } from "../managers/ScoreManager";
import { KEY_ENTER } from "../config/InputConfig";
import { GameOverOverlay } from "../ui/GameOverOverlay";

export class GameOverScene extends Scene {
  private readonly overlay: GameOverOverlay;
  private readonly soundManager: SoundManager;
  private result: GameResult | null = null;

  constructor(eventBus: EventBus, soundManager: SoundManager) {
    super();
    this.overlay = new GameOverOverlay();
    this.soundManager = soundManager;
    eventBus.on(EVT_GAME_OVER, (result: GameResult) => {
      this.result = result;
    });
  }

  public enter(): void {
    this.soundManager.play("uiClick");
  }

  public update(_deltaTime: number, input: Input): void {
    if (input.isKeyPressed(KEY_ENTER)) {
      this.switchTo("play");
    }
  }

  public render(renderer: Renderer): void {
    this.overlay.render(renderer, { result: this.result });
  }
}
