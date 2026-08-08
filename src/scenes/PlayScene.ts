import { Scene } from "../engine/Scene";
import { Renderer } from "../engine/Renderer";
import { Input } from "../engine/Input";
import { EventBus } from "../engine/EventBus";
import { Player } from "../entities/Player";
import { SpawnManager } from "../managers/SpawnManager";
import { ScoreManager, EVT_GAME_OVER } from "../managers/ScoreManager";
import { DifficultyManager } from "../managers/DifficultyManager";
import { GameStateManager } from "../managers/GameStateManager";
import { SoundManager } from "../managers/SoundManager";
import { ParticleEmitter } from "../particles/ParticleEmitter";
import { HUD } from "../ui/HUD";
import { PauseOverlay } from "../ui/PauseOverlay";
import { KEY_LEFT, KEY_RIGHT, KEY_PAUSE, KEY_PAUSE_ALT, KEY_MUTE } from "../config/InputConfig";
import { DEBUG_ENABLED, DEBUG_INFO_COLOR, DEBUG_FONT } from "../config/DebugConfig";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_SPEED,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  MAX_LIVES,
  GAME_DURATION,
  COIN_SCORE_VALUE,
} from "../config/GameConfig";

export class PlayScene extends Scene {
  private readonly player: Player;
  private readonly hud: HUD;
  private readonly pauseOverlay: PauseOverlay;
  private readonly spawnManager: SpawnManager;
  private readonly scoreManager: ScoreManager;
  private readonly difficulty: DifficultyManager;
  private readonly stateManager: GameStateManager;
  private readonly soundManager: SoundManager;
  private readonly particles: ParticleEmitter;
  private readonly eventBus: EventBus;
  private lives: number = MAX_LIVES;
  private timeLeft: number = GAME_DURATION;
  private elapsed: number = 0;

  constructor(eventBus: EventBus, soundManager: SoundManager) {
    super();
    this.player = new Player(
      GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
      GAME_HEIGHT - 60,
      PLAYER_WIDTH,
      PLAYER_HEIGHT,
      PLAYER_SPEED,
    );
    this.hud = new HUD();
    this.pauseOverlay = new PauseOverlay();
    this.difficulty = new DifficultyManager();
    this.spawnManager = new SpawnManager(30, this.difficulty);
    this.scoreManager = new ScoreManager(eventBus);
    this.stateManager = new GameStateManager();
    this.eventBus = eventBus;
    this.soundManager = soundManager;
    this.particles = new ParticleEmitter();
  }

  public enter(): void {
    this.player.reset(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
    this.spawnManager.reset();
    this.scoreManager.reset();
    this.difficulty.reset();
    this.stateManager.setState("PLAYING");
    this.particles.clear();
    this.lives = MAX_LIVES;
    this.timeLeft = GAME_DURATION;
    this.elapsed = 0;
    this.soundManager.startMusic();
  }

  public exit(): void {
    this.soundManager.stopMusic();
  }

  public update(deltaTime: number, input: Input): void {
    if (input.isKeyPressed(KEY_PAUSE) || input.isKeyPressed(KEY_PAUSE_ALT)) {
      this.stateManager.togglePause();
      this.soundManager.play("pause");
      if (this.stateManager.isPaused()) {
        this.soundManager.stopMusic();
      } else {
        this.soundManager.startMusic();
      }
    }

    if (input.isKeyPressed(KEY_MUTE)) {
      this.soundManager.toggleMuted();
      this.soundManager.play("uiClick");
    }

    if (this.stateManager.isPaused()) {
      return;
    }

    // Keyboard movement.
    if (input.isKeyDown(KEY_LEFT)) {
      this.player.moveLeft();
    } else if (input.isKeyDown(KEY_RIGHT)) {
      this.player.moveRight();
    } else {
      this.player.stop();
    }

    // Touch control foundation: move basket toward the touch X.
    if (input.getTouchX() > 0) {
      this.player.moveToward(input.getTouchX());
    }

    this.player.update(deltaTime);
    this.player.clampToScreen(GAME_WIDTH);

    this.difficulty.update(deltaTime);
    this.spawnManager.update(deltaTime);

    const result = this.spawnManager.checkCollisions(this.player.rect);
    for (const coin of result.collected) {
      this.scoreManager.add(COIN_SCORE_VALUE);
      this.soundManager.play("coin");
      this.particles.coinSparkle(coin.x, coin.y);
    }

    if (result.missed > 0) {
      this.lives -= result.missed;
      this.soundManager.play("lifeLost");
      this.particles.lifeLost(this.player.rect.centerX, this.player.rect.top);
      if (this.lives <= 0) {
        this.lives = 0;
        this.handleGameOver();
      }
    }

    this.particles.update(deltaTime);

    this.elapsed += deltaTime;
    this.timeLeft = Math.max(0, GAME_DURATION - Math.floor(this.elapsed));

    if (this.timeLeft <= 0) {
      this.handleGameOver();
    }

    this.hud.update({
      score: this.scoreManager.getScore(),
      highScore: this.scoreManager.getHighScore(),
      lives: this.lives,
      timeLeft: this.timeLeft,
      difficultyStage: this.difficulty.getStageName(),
      muted: this.soundManager.isMuted(),
    });
  }

  public render(renderer: Renderer): void {
    this.hud.render(renderer);
    this.spawnManager.render(renderer);
    this.particles.render(renderer);
    this.player.render(renderer);

    if (this.stateManager.isPaused()) {
      this.pauseOverlay.render(renderer, { muted: this.soundManager.isMuted() });
    }

    if (DEBUG_ENABLED) {
      renderer.fillText(
        `Player X: ${this.player.rect.x.toFixed(0)}  Y: ${this.player.rect.y.toFixed(0)}  ` +
          `VelX: ${this.player.getVelocityX().toFixed(0)}  ` +
          `Coins: ${this.spawnManager.getActiveCoins()}  ` +
          `SpawnTimer: ${this.spawnManager.getSpawnTimer().toFixed(2)}  ` +
          `Stage: ${this.stateManager.getState()}`,
        12,
        52,
        { color: DEBUG_INFO_COLOR, font: DEBUG_FONT },
      );
    }
  }

  private handleGameOver(): void {
    const result = this.scoreManager.finishGame(this.elapsed);
    this.soundManager.play("gameOver");
    this.particles.gameOver(this.player.rect.centerX, this.player.rect.centerY);
    this.eventBus.emit(EVT_GAME_OVER, result);
    this.switchTo("gameover");
  }
}
