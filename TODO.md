# XXX Game — Phase 5: Game Flow, Progression & Persistence

## Progress

- [x] 1. Add `KEY_PAUSE`/`KEY_MUTE` to InputConfig, audio/stage config to GameConfig
- [x] 2. Create `src/particles/Particle.ts` + `src/particles/ParticleEmitter.ts`
- [x] 3. Rewrite `SoundManager.ts` with Web Audio API (SFX + background music)
- [x] 4. Create `GameStateManager.ts` (PLAYING/PAUSED)
- [x] 5. Create `DifficultyManager.ts` (3-stage progression)
- [x] 6. Update `StorageManager` / `ScoreManager` (best time + high score result)
- [x] 7. Update `SpawnManager` + `Coin` for dynamic difficulty
- [x] 8. Update `HUD.ts` (high score, difficulty stage, mute indicator)
- [x] 9. Create `PauseOverlay.ts` + `GameOverOverlay.ts`
- [x] 10. Rewire `PlayScene.ts` (pause, timer, sounds, particles, difficulty)
- [x] 11. Update `GameOverScene.ts` + `main.ts` (shared SoundManager, audio unlock)
- [x] 12. Format (Prettier), lint (ESLint), typecheck (tsc), build (vite)
