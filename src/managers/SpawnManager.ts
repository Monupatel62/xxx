import { Coin } from "../entities/Coin";
import { Renderer } from "../engine/Renderer";
import { CollisionManager } from "../engine/CollisionManager";
import { Rect } from "../math/Rect";
import { Random } from "../math/Random";
import { GAME_WIDTH, GAME_HEIGHT, COIN_RADIUS, COIN_TYPES, CoinType } from "../config/GameConfig";
import { DifficultyManager } from "./DifficultyManager";

export interface CoinCollisionResult {
  collected: Coin[];
  missed: number;
}

export class SpawnManager {
  private readonly coins: Coin[] = [];
  private spawnTimer: number = 0;

  constructor(
    private readonly poolSize: number,
    private readonly difficulty: DifficultyManager,
  ) {}

  public reset(): void {
    for (const coin of this.coins) {
      coin.destroy();
    }
    this.coins.length = 0;
    this.spawnTimer = 0;
  }

  public update(deltaTime: number): void {
    this.spawnTimer -= deltaTime;

    if (this.spawnTimer <= 0) {
      this.spawnCoin();
      this.spawnTimer = this.difficulty.getSpawnInterval();
    }

    for (const coin of this.coins) {
      if (coin.active) {
        coin.update(deltaTime);
      }
    }
  }

  public render(renderer: Renderer): void {
    for (const coin of this.coins) {
      if (coin.active) {
        coin.render(renderer);
      }
    }
  }

  public checkCollisions(playerRect: Rect): CoinCollisionResult {
    const collected: Coin[] = [];
    let missed = 0;

    for (const coin of this.coins) {
      if (!coin.active) {
        continue;
      }

      const coinCircle = { x: coin.x, y: coin.y, radius: coin.radius };
      if (CollisionManager.circleRect(coinCircle, playerRect)) {
        collected.push(coin);
        coin.destroy();
      } else if (coin.y - coin.radius > GAME_HEIGHT) {
        missed++;
        coin.destroy();
      }
    }

    return { collected, missed };
  }

  public getActiveCoins(): number {
    let count = 0;
    for (const coin of this.coins) {
      if (coin.active) {
        count++;
      }
    }
    return count;
  }

  public getSpawnTimer(): number {
    return Math.max(0, this.spawnTimer);
  }

  private spawnCoin(): void {
    const reused = this.coins.find((coin) => !coin.active);
    const x = Random.range(COIN_RADIUS, GAME_WIDTH - COIN_RADIUS);
    const speed = this.difficulty.getCoinSpeed();
    const coinType = this.pickCoinType();

    if (reused) {
      reused.reset(x, -COIN_RADIUS, speed, coinType);
      return;
    }

    if (this.coins.length < this.poolSize) {
      this.coins.push(new Coin(x, -COIN_RADIUS, COIN_RADIUS, speed, coinType));
    }
  }

  private pickCoinType(): CoinType {
    const totalWeight = COIN_TYPES.reduce((sum, c) => sum + c.spawnWeight, 0);
    let roll = Random.range(0, totalWeight);
    for (const config of COIN_TYPES) {
      roll -= config.spawnWeight;
      if (roll <= 0) {
        return config.type;
      }
    }
    return "normal";
  }
}
