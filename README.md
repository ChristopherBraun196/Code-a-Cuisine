# Code à Cuisine

A smart web app with AI automation: generates matching recipes automatically from ingredients you already have. Built for home cooks and shared households — the goal is less food waste and more varied, healthy cooking. All generated recipes are browsable in a public library, no account required.

Final project of the Developer Akademie ("Join 2024" cohort). Built with [Angular CLI](https://github.com/angular/angular-cli) version 22.0.8.

## Features

- Ingredient input including amount (grams/pieces/liters), servings (1–12), time frame, cooking style, and diet filter
- AI recipe generation: exactly 3 suggestions per request, each using at least 70% of the entered ingredients
- Step-by-step directions with cooking-helper assignment (1–4 people) and marked parallel steps
- Nutrition analysis (calories, protein, carbs, fat) per serving and in total
- Public recipe library with cuisine filtering and pagination
- Quota system to protect against runaway AI usage costs

## Tech stack

- **Frontend:** Angular 22, SCSS, no SSR
- **Backend/automation:** [n8n](https://n8n.io/) (AI recipe generation, validation, error handling), running locally via Docker
- **AI model:** Google Gemini
- **Data storage:** Firebase Realtime Database
- **Design:** Figma mockup

## Getting started

### Prerequisites

- Node.js and npm
- A Firebase project with Realtime Database enabled

### Installation

```bash
npm install
```

### Firebase configuration

Firebase credentials live in `src/environments/environment.ts` and `environment.development.ts` (under the `firebase` key). Both files are gitignored and not part of the repo. Copy `environment.example.ts` → `environment.ts` and `environment.development.example.ts` → `environment.development.ts`, then fill in your own `firebaseConfig` from the Firebase console and your n8n webhook URL.

### Development server

```bash
npm start
```

The app is then available at `http://localhost:4200/` and reloads automatically on changes.

## Available scripts

| Command               | Description                                                          |
| ---------------------- | ---------------------------------------------------------------------- |
| `npm start`            | Starts the Angular dev server                                        |
| `npm run build`        | Creates a production build in `dist/`                                |
| `npm test`             | Runs the unit tests                                                  |


## Project structure

```
src/app/pages/             Page components (Home, Generator, Cookbook, Recipe Detail, ...)
src/app/shared/            Header, data models, Firebase service
src/app/firebase.ts        Firebase app initialization
scripts/                   Local development tools (seed scripts, admin UI)
```
