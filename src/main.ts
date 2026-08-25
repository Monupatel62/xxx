import "./styles/main.css";
import { Game } from "./engine/Game";
import { SoundManager } from "./managers/SoundManager";
import { MenuScene } from "./scenes/MenuScene";
import { PlayScene } from "./scenes/PlayScene";
import { GameOverScene } from "./scenes/GameOverScene";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error('App container "#app" was not found in the DOM.');
}

const canvas = document.createElement("canvas");
app.appendChild(canvas);

const game = new Game(canvas);
const soundManager = new SoundManager();

// Unlock Web Audio on first user gesture (autoplay policy).
function unlockAudio(): void {
  soundManager.unlock();
  window.removeEventListener("pointerdown", unlockAudio);
  window.removeEventListener("keydown", unlockAudio);
}
window.addEventListener("pointerdown", unlockAudio);
window.addEventListener("keydown", unlockAudio);

const eventBus = game.getEventBus();
game.registerScene("menu", new MenuScene(soundManager));
game.registerScene("play", new PlayScene(eventBus, soundManager));
game.registerScene("gameover", new GameOverScene(eventBus, soundManager));
game.startScene("menu");
game.start();
