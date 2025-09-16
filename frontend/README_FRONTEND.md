
---

## `SmartPath/frontend/README_FRONTEND.md`
```md
# Frontend (React + Tailwind + TensorFlow.js)

## Install & Run (Windows)
1. Open PowerShell or Command Prompt.
2. `cd SmartPath\frontend`
3. `npm install`
4. `npm start`

The app will open at http://localhost:3000.

## Notes about Tailwind & PostCSS
- Tailwind is used via `@tailwindcss/postcss` in `postcss.config.js`.
- No Tailwind CLI is required; CRA + PostCSS will process the Tailwind directives.

## ML (TensorFlow.js)
- The ML demo trains in-browser — it may take a few seconds depending on CPU.
- The model is intentionally tiny: it's for demonstration of wiring ML into the UI, not for production routing.
