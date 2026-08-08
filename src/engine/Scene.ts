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

  public bindSceneManager(manager: SceneManager): void {
    this.sceneManager = manager;
  }

  protected switchTo(name: string): void {
    this.sceneManager?.switchTo(name);
  }
}
