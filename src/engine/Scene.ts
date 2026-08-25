import { Renderer } from "./Renderer";
import { Input } from "./Input";
import type { SceneManager } from "./SceneManager";

export abstract class Scene {
  private sceneManager: SceneManager | null = null;

  public abstract update(deltaTime: number, input: Input): void;
  public abstract render(renderer: Renderer): void;

  public enter(): void {
    // Optional lifecycle hook - override in subclasses.
  }

  public exit(): void {
    // Optional lifecycle hook - override in subclasses.
  }

  public destroy(): void {
    // Optional cleanup hook — called when a scene is permanently removed.
    // Override to unsubscribe events, cancel timers, etc.
  }

  public bindSceneManager(manager: SceneManager): void {
    this.sceneManager = manager;
  }

  protected switchTo(name: string): void {
    this.sceneManager?.switchTo(name);
  }
}
