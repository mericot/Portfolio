# Portfolio (React + Spring Boot)

A full-stack portfolio project with:
- `frontend/`: React + Vite single-page app
- `backend/`: Spring Boot REST API scaffold

This repository is organized so you can build your portfolio UI quickly while expanding backend features as needed.

## Repository Structure

```text
Portfolio/
├── frontend/                     # React app (Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── styles/style.css
│   │   └── utils/data.js
│   ├── index.html
│   └── package.json
├── backend/                      # Spring Boot API
│   ├── src/main/java/com/portfolio/backend/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── exception/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── service/
│   │   └── util/
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── db/migration/
│   └── pom.xml
└── README.md
```

## Tech Stack

### Frontend
- React 18
- Vite 5
- Plain CSS (customizable)

### Backend
- Spring Boot 4.0.1
- Java 21
- Maven Wrapper (`./mvnw`)
- Starters:
  - `spring-boot-starter-webmvc`
  - `spring-boot-starter-validation`
  - `spring-boot-starter-actuator`

## Prerequisites

- Node.js 18+ and npm
- Java 21

## Frontend: Run Locally

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

### Frontend Build

```bash
cd frontend
npm run build
```

Output is generated in `frontend/dist`.

## Backend: Run Locally

```bash
cd backend
./mvnw spring-boot:run
```

Default API base URL:
- `http://localhost:8080`

Actuator endpoint example:
- `http://localhost:8080/actuator/health`

### Backend Tests

```bash
cd backend
./mvnw test
```

## Development Workflow

1. Start backend:
   - `cd backend && ./mvnw spring-boot:run`
2. Start frontend in a second terminal:
   - `cd frontend && npm run dev`
3. Build UI in React and add API routes/controllers in Spring Boot.

## Where To Customize

### Frontend
- Main layout and sections: `frontend/src/App.jsx`
- Content data (projects/skills/typed text): `frontend/src/utils/data.js`
- Styling/theme: `frontend/src/styles/style.css`

### Backend
- HTTP endpoints: `backend/src/main/java/com/portfolio/backend/controller`
- Business logic: `backend/src/main/java/com/portfolio/backend/service`
- DTOs/models: `backend/src/main/java/com/portfolio/backend/dto`, `.../model`
- Validation and shared utilities: `.../util`, `.../exception`

## Suggested Next Backend Steps

1. Add a `ContactController` with `POST /api/contact`.
2. Add request DTO + validation annotations.
3. Add service layer for business logic.
4. Wire frontend form submission to backend endpoint.
5. Add CORS config if frontend/backend run on different ports.

## Git Quick Commands

```bash
git status
git add .
git commit -m "<message>"
git push origin main
```

## Notes

- `frontend/node_modules` and `frontend/dist` are generated locally and should not be committed.
- Keep environment-specific values out of source control; use environment variables when adding secrets.
