const GAMEPLAY_CLASS = "game-playing";

/**
 * Keeps ad overlays from intercepting the game surface while the play loop is
 * active. The ad provider remains initialized by index.html and controls its
 * own rendering outside active gameplay.
 */
export function setGameplayAdProtection(active: boolean): void {
  document.body.classList.toggle(GAMEPLAY_CLASS, active);
}
