import { Renderer } from "../engine/Renderer";

export abstract class Entity {
  public isActive: boolean = true;

  public abstract update(deltaTime: number): void;

  public abstract render(renderer: Renderer): void;

  public destroy(): void {
    this.isActive = false;
  }

  public get active(): boolean {
    return this.isActive;
  }
}
