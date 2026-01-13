# Architecture Analysis: KosakataQ

## Overview
**KosakataQ** is a Single Page Application (SPA) designed as a Quranic vocabulary learning game. It uses Vue.js for the frontend framework and relies on static JSON files as a database, making it a serverless, client-side only application.

## Technology Stack
- **Framework:** Vue.js
  - **Identified Issue:** `package.json` specifies Vue 3 (`^3.5.13`), but the codebase (e.g., `src/main.js`, `src/router/index.js`) uses Vue 2 syntax (`new Vue()`, `Vue.use()`). This suggests a broken upgrade or legacy state.
- **State Management:** Vuex v4
- **Routing:** Vue Router (v3 syntax used)
- **Styling:** Tailwind CSS v3 (via `vue-tailwind`)
- **Build Tool:** Vue CLI (Webpack)
- **Persistence:** `localStorage` (for game history)

## Project Structure
- **Entry Point:** `src/main.js` initializes the app, store, and router.
- **Data Source:** `src/assets/*.json` contains all Quranic text, translations, and word mappings. No external API is used.
- **State (`src/store/index.js`):**
  - Loads all JSON data into memory on startup.
  - Manages game logs and history.
  - Persists `game_logs` to browser `localStorage`.
- **Views:**
  - `SurahPickerView`: Lists Surahs for selection.
  - `GameScreenView`: The core gameplay loop (Quiz logic).
  - `GameStatisticsView`: Visualizes user progress.
  - `LicenseView`, `PlayingGuideView`, `CreditView`: Static informational pages.

## Data Flow
1. **Initialization:** app loads JSON datasets from `assets` into Vuex state.
2. **Selection:** User selects a Surah in `SurahPickerView`.
3. **Gameplay:** `GameScreenView` generates quizzes based on the selected Surah using logic in `mixin/generator.js`.
4. **Completion:** On game end, results are committed to Vuex and saved to `localStorage`.

## Key Findings & Recommendations
> [!WARNING]
> **Critical Version Mismatch**: The project has Vue 3 dependencies installed but is written in Vue 2 code. This will likely cause build or runtime errors.
> **Recommendation**: Either downgrade dependencies to Vue 2 (safe) or refactor the entry point and router/store usage to Vue 3 syntax (modernize).

> [!NOTE]
> **Performance**: Loading all JSON data into memory (bundled) is fast for user experience but increases initial bundle size. Current dataset seems small enough for this to be acceptable.
