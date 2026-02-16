# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

HackYourFuture (HYF) assignment repo for Core Program Week 10. Contains two tasks focused on async API integration, file I/O, and HTTP CRUD operations.

Our students are called **"trainees"** — never use the word "student" in documentation (`.md` files). Code files (`.js`) are exempt.

Trainees implement the solutions; code intended for trainees should be simple and inline rather than abstracted.

README files are trainee-facing — don't expose internal/admin details. All code must work cross-platform (macOS, Windows, Linux). The `.hyf/` folder is CI/grading infrastructure and is exempt from these rules.

## Commands

```bash
npm install                    # Install dependencies
npm test                       # Run all tests (watch mode)
npm run test:run               # Run all tests once
npm run test:cocktail          # Test Task 1 only
npm run test:get               # Test Task 2 GET requests
npm run test:post              # Test Task 2 POST requests
npm run test:crud              # Test Task 2 CRUD operations
npm run task2                  # Run the Post Central CLI app
node task-1/cocktail.js <name> # Run cocktail CLI (e.g. "margarita")
```

To run a single test file directly: `npx vitest run <path-to-test-file>`

## Architecture

- **ES Modules** throughout (`"type": "module"` in package.json)
- **Vitest** for testing (globals enabled, 30s timeout, sequential execution)
- Tests live in `task-*/tests/` directories alongside their task code

### Task 1 — Cocktail Recipe CLI (`task-1/cocktail.js`)

Fetches from TheCocktailDB API, generates markdown for all matching drinks, writes to `task-1/output/`. Tests use mock drink data from `task-1/tests/drinks.js` and mock `fetch` via `vi.fn()`.

### Task 2 — Post Central API Services (`task-2/src/services.js`)

Implements REST client functions (register, login, CRUD for posts/users) against `http://localhost:3000`. Uses JWT auth via module-level `token` variable with `getToken()`/`setToken()` helpers. `registerUser` is pre-implemented as a reference. The CLI (`task-2/src/post-cli.js`) uses `@inquirer/prompts` and `chalk`. Tests mock `fetch` with `vi.spyOn(global, 'fetch')`.
