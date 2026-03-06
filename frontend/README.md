# Frontend (React + Vite)

This frontend is a minimal React setup so you can customize safely while learning.

## Requirements
- Node.js 18+
- npm

## Run Locally
```bash
cd /Users/mericot/Desktop/Projects/Portfolio/frontend
npm install
npm run dev
```

Open the URL shown in terminal (usually `http://localhost:5173`).

## Build
```bash
npm run build
```

Production output is generated in `frontend/dist`.

## Project Layout
- `index.html` - page shell and root mount node
- `src/main.jsx` - React bootstrap entry
- `src/App.jsx` - main UI component
- `src/styles/style.css` - global styles and theme tokens
- `src/utils/data.js` - editable portfolio content

## Common Commands
```bash
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview production build locally
```

## Notes
- Run commands from the `frontend` directory, not repo root.
- The learning guide is in `REACT_LEARNING_GUIDE.txt` at repo root (kept out of git on purpose).
