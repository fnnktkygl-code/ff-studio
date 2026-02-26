# FF Studio — AI-Powered Fashion Photography Studio

FF Studio is a React + Vite web application backed by an Express API server. It uses the Google Gemini API to generate AI fashion photography.

---

## Prerequisites

- **Node.js** v18 or later
- A **Google Gemini API key** — get one free at <https://aistudio.google.com/app/apikey>

---

## Installation

```bash
npm install
```

---

## Environment variables

Copy the example file and fill in your Gemini API key:

```bash
cp .env.example .env
```

Open `.env` and set:

```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001           # optional, defaults to 3001
```

---

## Running the app

### Development (recommended)

Starts both the Vite dev server (port 5173) and the Express API server (port 3001) with hot-reloading:

```bash
npm run dev:all
```

Then open <http://localhost:5173> in your browser.

You can also start them separately if you prefer:

```bash
# Frontend only
npm run dev

# Backend only
npm run dev:server
```

### Production

Build the frontend and serve everything from the Express server:

```bash
npm run build
npm start
```

Then open <http://localhost:3001> in your browser.

---

## Deploying to Render

A `render.yaml` file is included. Push your repository to GitHub, connect it in the [Render dashboard](https://dashboard.render.com/), and set the `GEMINI_API_KEY` environment variable manually. Render will run `npm install && npm run build` and then `npm start` automatically.
