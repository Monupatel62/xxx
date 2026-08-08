# 🎮 XXX Game — Phase 2: Game Engine Architecture

> **Status:** ✅ Complete
>
> **Goal:** Build a **reusable 2D game engine architecture** — clean, modular, single-responsibility design. With this engine, not just "Catch the Coin" but also Snake, Breakout, Flappy Bird, Space Shooter, and other canvas games can be built.

---

## What Was Completed

A professional, decoupled engine under `src/engine/` with each class having exactly **one responsibility**.

### Engine Modules

```
src/engine/
├── Game.ts          → Orchestrator — init, start, switch scenes, debug overlay
├── GameLoop.ts      → Fixed timestep loop, delta time accumulation
├── Renderer.ts      → Canvas wrapper — clear screen, draw primitives, text
├── Input.ts         → Keyboard, mouse, touch input system
├── Time.ts          → Delta time, elapsed time, FPS counter
├── Scene.ts         → Abstract scene base class
├── SceneManager.ts  → Scene registration & switching
├── Camera.ts        → Transform for future scrolling support
└── AssetLoader.ts   → Images, audio, fonts loading
```

### Module Responsibilities

| Module | Responsibility |
| ------ | -------------- |
| **Game** | Initialize game, start engine, switch scenes, debug overlay |
| **GameLoop** | Fixed timestep, delta time, FPS calculation |
| **Renderer** | Canvas rendering, clear screen, draw primitives |
| **Input** | Keyboard, mouse, touch support |
| **Time** | Delta time, elapsed time, FPS |
| **Scene** | Menu, playing, pause, game over states |
| **SceneManager** | Scene registration & switching |
| **Camera** | Future scrolling support |
| **AssetLoader** | Images, audio, fonts |

### Architecture

```text
main.ts
    │
    ▼
Game
    │
    ▼
SceneManager
    │
    ▼
GameLoop  (fixed timestep + delta time)
    │
 ┌──┴───────────────┐
 ▼                  ▼
Update()        Render()
 │                  │
 ▼                  ▼
Scene           Renderer
 (Input)             │
 │                  ▼
 └──────► Canvas ◄──┘
```

### Coding Standards Applied

Each class has a single responsibility:

```text
Game.ts          ❌ No coin logic
Player.ts        ❌ No rendering engine
Renderer.ts      ❌ No keyboard handling
Input.ts         ❌ No score management
```

### Demo Scene

A `DemoScene` was added to prove the engine works end-to-end:
- A green block moves with **arrow keys**
- Live **mouse position** display
- A gold coin indicator (top-right)
- Press **F3** to toggle the **debug overlay** (FPS, delta time, elapsed time)

### Game Loop Features

- **Fixed timestep** — consistent physics regardless of refresh rate
- **Delta time** — frame-rate independent movement
- **Accumulator** pattern — prevents spiral of death
- **FPS counter** — computed over 0.5s windows

### Input System

- **Keyboard** — held keys + edge-triggered `pressed` detection
- **Mouse** — position + down/pressed states
- **Touch** — touch position (mobile foundation)
- Auto-cleans state on window blur (prevents stuck keys)

### Renderer

- Canvas 2D context wrapper
- Primitives: `fillRect`, `strokeRect`, `fillCircle`, `strokeCircle`, `line`, `fillText`
- Screen resize handling preserving aspect ratio

---

## Verification Results

| Check | Command | Result |
| ----- | ------- | ------ |
| TypeScript | `tsc --noEmit` | ✅ Passed (0 errors) |
| Lint | `eslint .` | ✅ Passed (0 errors) |
| Build | `vite build` | ✅ Passed (13 modules, ~9.8 kB JS) |
| Dev server | `vite dev` | ✅ Serves at `http://localhost:5173/` |

---

## How to Run

```bash
cd d:/x/xxx-game
npm run dev
```

Then open **http://localhost:5173**:
- **Arrow keys** → move the green block
- **F3** → toggle debug overlay (FPS, delta, elapsed)
- **Mouse** → move the cursor to see live coordinates

---

## ✅ Phase 2 Complete

We now have a **reusable 2D game engine**. The engine is decoupled from any specific game, making it easy to build:
- Catch the Coin
- Snake
- Breakout
- Flappy Bird
- Space Shooter

**Phase 3** will add the first real game scene — **Player movement** (Catch the Coin) built on top of this engine.
