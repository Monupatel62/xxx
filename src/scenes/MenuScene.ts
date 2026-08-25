import { Scene } from "../engine/Scene";
import { Renderer } from "../engine/Renderer";
import { Input } from "../engine/Input";
import { SoundManager } from "../managers/SoundManager";
import { StorageManager } from "../managers/StorageManager";
import { BackgroundRenderer } from "../effects/BackgroundRenderer";
import { KEY_ENTER, KEY_SPACE } from "../config/InputConfig";
import { GAME_WIDTH, GAME_HEIGHT, STORAGE_HIGH_SCORE_KEY } from "../config/GameConfig";

export class MenuScene extends Scene {
  private readonly background: BackgroundRenderer;
  private readonly soundManager: SoundManager;
  private elapsed: number = 0;
  private highScore: number;

  constructor(soundManager: SoundManager) {
    super();
    this.background = new BackgroundRenderer(40);
    this.soundManager = soundManager;
    this.highScore = StorageManager.getNumber(STORAGE_HIGH_SCORE_KEY, 0);
  }

  public enter(): void {
    this.elapsed = 0;
    this.highScore = StorageManager.getNumber(STORAGE_HIGH_SCORE_KEY, 0);
  }

  public update(deltaTime: number, input: Input): void {
    this.elapsed += deltaTime;
    this.background.update(deltaTime);

    if (input.isKeyPressed(KEY_ENTER) || input.isKeyPressed(KEY_SPACE)) {
      this.soundManager.play("uiClick");
      this.switchTo("play");
      return;
    }

    if (input.isMousePressed()) {
      this.soundManager.play("uiClick");
      this.switchTo("play");
    }
  }

  public render(renderer: Renderer): void {
    this.background.render(renderer);

    const titleBob = Math.sin(this.elapsed * 2) * 6;
    const pulse = 0.7 + 0.3 * Math.sin(this.elapsed * 3);

    renderer.fillText("CATCH THE COIN", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 90 + titleBob, {
      color: "#4ade80",
      font: "bold 44px Arial",
      align: "center",
    });

    renderer.fillText("★ ★ ★", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 45, {
      color: `rgba(250, 204, 21, ${pulse.toFixed(2)})`,
      font: "24px Arial",
      align: "center",
    });

    renderer.fillText("Catch coins with your basket!", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 10, {
      color: "#ffffff",
      font: "18px Arial",
      align: "center",
    });

    if (this.highScore > 0) {
      renderer.fillText(`🏆 High Score: ${this.highScore}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 25, {
        color: "#ffd93d",
        font: "20px Arial",
        align: "center",
      });
    }

    const blink = Math.floor(this.elapsed * 2) % 2 === 0;
    if (blink) {
      renderer.fillText("Press ENTER / SPACE or tap to start", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 70, {
        color: "#ffd93d",
        font: "22px Arial",
        align: "center",
      });
    }

    renderer.fillText("← → move  |  ESC pause  |  M mute", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 115, {
      color: "#666666",
      font: "14px Arial",
      align: "center",
    });

    renderer.fillText(
      "Gold +10  |  Silver +5  |  ★ Bonus +25  |  Combo multiplier!",
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2 + 145,
      {
        color: "#88d0ff",
        font: "13px Arial",
        align: "center",
      },
    );

    // Decorative falling coins
    for (let i = 0; i < 5; i++) {
      const x = 120 + i * 140;
      const y = ((this.elapsed * 80 + i * 100) % (GAME_HEIGHT + 40)) - 20;
      renderer.fillCircle(x, y, 10, "#facc15");
      renderer.strokeCircle(x, y, 10, "#a16207", 2);
    }
  }
}
