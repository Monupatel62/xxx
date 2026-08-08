import { Scene } from "../engine/Scene";
import { Renderer } from "../engine/Renderer";
import { Input } from "../engine/Input";
import { KEY_ENTER } from "../config/InputConfig";
import { GAME_WIDTH, GAME_HEIGHT } from "../config/GameConfig";

export class MenuScene extends Scene {
  public update(_deltaTime: number, input: Input): void {
    if (input.isKeyPressed(KEY_ENTER)) {
      this.switchTo("play");
    }
  }

  public render(renderer: Renderer): void {
    renderer.fillText("XXX GAME", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60, {
      color: "#4ade80",
      font: "48px Arial",
      align: "center",
    });
    renderer.fillText("Catch coins with the basket!", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 10, {
      color: "#ffffff",
      font: "20px Arial",
      align: "center",
    });
    renderer.fillText("Press ENTER to start", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, {
      color: "#ffd93d",
      font: "24px Arial",
      align: "center",
    });
    renderer.fillText("Use ← → arrow keys to move", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 80, {
      color: "#88d0ff",
      font: "18px Arial",
      align: "center",
    });
  }
}
