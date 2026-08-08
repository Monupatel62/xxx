import { Renderer } from "../engine/Renderer";
import { Time } from "../engine/Time";
import {
  DEBUG_FONT,
  DEBUG_FPS_COLOR,
  DEBUG_DELTA_COLOR,
  DEBUG_ELAPSED_COLOR,
  DEBUG_INFO_COLOR,
} from "../config/DebugConfig";

export interface DebugLine {
  label: string;
  value: string;
}

export class DebugOverlay {
  private extraLines: DebugLine[] = [];

  public setInfo(lines: DebugLine[]): void {
    this.extraLines = lines;
  }

  public render(renderer: Renderer, time: Time): void {
    const height = renderer.getHeight();
    const startY = height - 60;

    renderer.fillText(`FPS: ${time.getFps()}`, 16, startY, {
      color: DEBUG_FPS_COLOR,
      font: DEBUG_FONT,
    });
    renderer.fillText(`Delta: ${time.getDeltaTime().toFixed(4)}s`, 16, startY + 20, {
      color: DEBUG_DELTA_COLOR,
      font: DEBUG_FONT,
    });
    renderer.fillText(`Elapsed: ${time.getElapsedTime().toFixed(1)}s`, 16, startY + 40, {
      color: DEBUG_ELAPSED_COLOR,
      font: DEBUG_FONT,
    });

    for (let i = 0; i < this.extraLines.length; i++) {
      const line = this.extraLines[i];
      renderer.fillText(`${line.label}: ${line.value}`, renderer.getWidth() - 16, startY + i * 20, {
        color: DEBUG_INFO_COLOR,
        font: DEBUG_FONT,
        align: "right",
      });
    }
  }
}
