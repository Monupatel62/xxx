# 🎮 XXX Game — Phase 1: Project Setup

> **Status:** ✅ Complete
>
> **Goal:** A clean, scalable TypeScript project foundation using Vite, so future game development is easy.

---

## What Was Completed

### 1. Project Created

- Scaffolded a **Vite + vanilla TypeScript** project named `xxx-game` at `d:/x/xxx-game`.
- Node.js `v22.12.0` and npm `10.9.0` verified before setup.

### 2. Development Tools Installed

- **ESLint** — code linting
- **Prettier** — code formatting
- **@typescript-eslint/parser** & **@typescript-eslint/eslint-plugin** — TypeScript linting
- **eslint-config-prettier** & **eslint-plugin-prettier** — Prettier & ESLint integration

### 3. Folder Structure Created

```
xxx-game/
├── public/
│   └── assets/
│       ├── images/   (.gitkeep)
│       ├── sounds/   (.gitkeep)
│       └── fonts/    (.gitkeep)
├── src/
│   ├── engine/       → Game.ts
│   ├── entities/     → Player.ts, Coin.ts
│   ├── ui/           → HUD.ts
│   ├── utils/        → Constants.ts
│   ├── styles/       → main.css
│   ├── main.ts
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
├── .prettierrc
└── .prettierignore
```

### 4. Default Files Cleaned

- Removed Vite template boilerplate (`counter.ts`, `typescript.svg`, `style.css`).
- Kept only `main.ts` as the entry point.

### 5. Source Files Created

| File                     | Purpose                                                              |
| ------------------------ | -------------------------------------------------------------------- |
| `src/engine/Game.ts`     | Game class — canvas setup, 60 FPS game loop, update/render pipeline  |
| `src/entities/Player.ts` | Player entity — position, dimensions, speed, `update()` and `draw()` |
| `src/entities/Coin.ts`   | Coin entity — position, radius, speed, `update()` and `draw()`       |
| `src/ui/HUD.ts`          | Heads-up display — renders score and lives                           |
| `src/utils/Constants.ts` | Central game constants                                               |
| `src/styles/main.css`    | Dark theme, centered canvas layout                                   |
| `src/main.ts`            | Entry point — imports CSS, creates canvas, boots the game            |

### 6. Constants Defined

```ts
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
export const FPS = 60;
export const PLAYER_SPEED = 8;
export const COIN_SPEED = 3;
export const MAX_LIVES = 3;
```

### 7. CSS Styled

- Global reset (`margin`, `padding`, `box-sizing`).
- Dark background (`#111`), hidden overflow.
- `#app` flex-centered container filling the viewport.
- Styled game canvas with background and subtle shadow.

### 8. index.html Replaced

- Clean HTML with `#app` container.
- Loads `/src/main.ts` as a module.
- Responsive viewport meta tag.

---

## Verification Results

| Check      | Command        | Result                                |
| ---------- | -------------- | ------------------------------------- |
| TypeScript | `tsc --noEmit` | ✅ Passed (0 errors)                  |
| Lint       | `eslint .`     | ✅ Passed (0 errors)                  |
| Build      | `vite build`   | ✅ Passed (built in ~343ms)           |
| Dev server | `vite dev`     | ✅ Serves at `http://localhost:5173/` |

---

## How to Run

```bash
cd d:/x/xxx-game
npm run dev
```

Then open **http://localhost:5173** — you'll see:

- A game canvas (800×600)
- A green player block near the bottom
- HUD showing **Score: 0** and **Lives: 3**
- The 60 FPS game loop running

---

## ✅ Phase 1 Complete

The project is now a clean, scalable, production-quality foundation. **Phase 2** will add the game engine — Canvas setup refinement, game loop, rendering, input handling, and animation system — so the game starts actually running.
