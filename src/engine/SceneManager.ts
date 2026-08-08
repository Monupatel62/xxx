import { Scene } from "./Scene";
import { Renderer } from "./Renderer";
import { Input } from "./Input";

export class SceneManager {
  private readonly scenes: Map<string, Scene> = new Map();
  private currentScene: Scene | null = null;
  private currentSceneName: string | null = null;

  public add(name: string, scene: Scene): void {
    scene.bindSceneManager(this);
    this.scenes.set(name, scene);
  }

  public switchTo(name: string): void {
    const scene = this.scenes.get(name);
    if (!scene) {
      throw new Error(`Scene "${name}" was not registered.`);
    }
    if (this.currentScene) {
      this.currentScene.exit();
    }
    this.currentScene = scene;
    this.currentSceneName = name;
    scene.enter();
  }

  public update(deltaTime: number, input: Input): void {
    this.currentScene?.update(deltaTime, input);
  }

  public render(renderer: Renderer): void {
    this.currentScene?.render(renderer);
  }

  public getCurrent(): Scene | null {
    return this.currentScene;
  }

  public getCurrentName(): string | null {
    return this.currentSceneName;
  }
}
