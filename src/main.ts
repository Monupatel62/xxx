import "./styles/main.css";
import { Game } from "./engine/Game";
import { SoundManager } from "./managers/SoundManager";
import { MenuScene } from "./scenes/MenuScene";
import { PlayScene } from "./scenes/PlayScene";
import { GameOverScene } from "./scenes/GameOverScene";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error('App container "#app" was not found.');

const canvas = document.createElement("canvas");
app.appendChild(canvas);

const game = new Game(canvas);
const soundManager = new SoundManager();

// ── Audio unlock on first gesture ────────────────────────────────────────────
function unlockAudio(): void {
  soundManager.unlock();
  window.removeEventListener("pointerdown", unlockAudio);
  window.removeEventListener("keydown", unlockAudio);
}
window.addEventListener("pointerdown", unlockAudio);
window.addEventListener("keydown", unlockAudio);

// ── PWA Install prompt ───────────────────────────────────────────────────────
let deferredInstallPrompt: Event | null = null;
const installBtn = document.getElementById("pwa-install-btn") as HTMLButtonElement | null;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  if (installBtn) installBtn.style.display = "inline-flex";
});

if (installBtn) {
  installBtn.addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    (deferredInstallPrompt as any).prompt();
    const { outcome } = await (deferredInstallPrompt as any).userChoice;
    if (outcome === "accepted") installBtn.style.display = "none";
    deferredInstallPrompt = null;
  });
}

if (window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches) {
  if (installBtn) installBtn.style.display = "none";
}

window.addEventListener("appinstalled", () => {
  if (installBtn) installBtn.style.display = "none";
  deferredInstallPrompt = null;
});

export async function enterFullscreen(): Promise<void> {
  try {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      await el.requestFullscreen({ navigationUI: "hide" });
    } else if ((el as any).webkitRequestFullscreen) {
      await (el as any).webkitRequestFullscreen();
    } else if ((el as any).mozRequestFullScreen) {
      await (el as any).mozRequestFullScreen();
    } else if ((el as any).msRequestFullscreen) {
      await (el as any).msRequestFullscreen();
    }
    try {
      await (screen.orientation as any).lock("landscape");
    } catch {
      // Orientation lock is optional.
    }
  } catch {
    // Fullscreen is optional; the game still works in normal mode.
  }
}

export function exitFullscreen(): void {
  try {
    if (document.fullscreenElement) document.exitFullscreen?.();
  } catch {
    // Ignore unsupported or denied fullscreen requests.
  }
}

function showIOSInstallHint(): void {
  document.getElementById("ios-install-hint")?.remove();

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const msg = isIOS
    ? "To install: tap the <strong>Share</strong> button (□↑) at the bottom of Safari, then tap <strong>\"Add to Home Screen\"</strong>"
    : "To install: click the <strong>install icon (⊕)</strong> in your browser's address bar, or use browser menu → \"Install app\"";

  const overlay = document.createElement("div");
  overlay.id = "ios-install-hint";
  overlay.innerHTML = `
    <div class="ios-hint-box">
      <p>📲 <strong>Install Catch the Coin</strong></p>
      <p>${msg}</p>
      <button onclick="document.getElementById('ios-install-hint').remove()">Got it ✕</button>
    </div>
  `;
  overlay.style.cssText = `
    position:fixed;bottom:0;left:0;right:0;z-index:9999;
    padding:12px 16px 20px;
    background:linear-gradient(to top,rgba(10,10,30,0.98),rgba(10,10,30,0.92));
    backdrop-filter:blur(8px);
    border-top:2px solid rgba(99,179,237,0.6);
    text-align:center;font-family:Arial,sans-serif;color:#e2e8f0;
    animation:slideUp 0.3s ease;
  `;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.remove(), 8000);
}

const eventBus = game.getEventBus();
const menuScene = new MenuScene(soundManager, enterFullscreen, () => {
  if (deferredInstallPrompt) {
    (deferredInstallPrompt as any).prompt();
    (deferredInstallPrompt as any).userChoice.then(({ outcome }: { outcome: string }) => {
      if (outcome === "accepted") {
        menuScene.setInstallAvailable(false);
        if (installBtn) installBtn.style.display = "none";
      }
      deferredInstallPrompt = null;
    });
  } else {
    showIOSInstallHint();
  }
});

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  if (installBtn) installBtn.style.display = "inline-flex";
  menuScene.setInstallAvailable(true);
});
window.addEventListener("appinstalled", () => menuScene.setInstallAvailable(false));

const isInstalled =
  window.matchMedia("(display-mode: standalone)").matches ||
  window.matchMedia("(display-mode: fullscreen)").matches ||
  (navigator as any).standalone === true;

if (!isInstalled) menuScene.forceShowInstall();

game.registerScene("menu", menuScene);
game.registerScene("play", new PlayScene(eventBus, soundManager));
game.registerScene("gameover", new GameOverScene(eventBus, soundManager));
game.startScene("menu");
game.start();
