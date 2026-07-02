# FF Studio 📸✨

FF Studio is a React-based web application for AI-powered fashion garment generation, using Google's Gemini and Imagen models to create high-quality on-model and product images from flat lays.

## Architecture & Deployment Modes

The application supports 3 distinct modes of operation to accommodate different deployment scenarios and security needs:

### 1. Client-Direct Mode (Default/Fallback)
The React frontend calls the Gemini API directly from the browser. 
- **Best for:** Local development, personal use, or purely static hosting (e.g., GitHub Pages).
- **Security:** The API key is stored in the browser's `localStorage`. **Not recommended for public production** as the key is exposed to the client.
- **Setup:** Users are prompted to enter their Gemini API key in the Settings modal in the UI.

### 2. Express Server Mode
A local Node.js backend handles the API calls to Gemini.
- **Best for:** Secure deployments where you control the server (e.g., Render, Heroku).
- **Security:** The API key is safely stored on the server. Includes basic rate-limiting.
- **Run:** `node server/index.js` (runs on port 3001 by default).

### 3. Google Cloud Function Mode (Vertex AI)
A serverless function deployed on Google Cloud (GCP) handles the requests using Vertex AI.
- **Best for:** Enterprise production, high scalability, and taking advantage of Vertex AI's SLA and pricing.
- **Security:** Fully secure, uses GCP Service Accounts and IAM.
- **Setup:** Deploy the contents of the `cloud-function/` directory to GCP. Provide the deployed URL to the frontend via the `VITE_CLOUD_FUNCTION_URL` environment variable.

---

## Environment Variables

Create a `.env` file in the root of the project to configure the application.

### Frontend Variables (`.env`)
```env
# URL of your deployed Cloud Function (Mode 3). If omitted, falls back to local server/client-direct.
VITE_CLOUD_FUNCTION_URL=https://your-cloud-function-url.a.run.app

# Which pricing profile to use as default for cost estimation.
VITE_PRICING_IMAGE_MODEL=gemini-2.5-flash-image
```

### Server Variables (`.env`)
These are required if running the local Express Server (Mode 2).
```env
# Your Gemini API Key
GEMINI_API_KEY=your_gemini_api_key

# Optional: Allow specific origins for CORS (default allows localhost)
ALLOWED_ORIGIN=https://your-frontend-domain.com

# Optional: Server port (default 3001)
PORT=3001
```

### Cloud Function Variables
These are required when deploying the Cloud Function (Mode 3).
```env
# The GCP Location where your Vertex models are deployed (e.g., us-central1)
GOOGLE_CLOUD_LOCATION=us-central1
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Google Gemini API Key (or Google Cloud Project with Vertex AI enabled)

### Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the Frontend (Vite):**
   ```bash
   npm run dev
   ```
   *The app will be available at `http://localhost:5173`.*

3. **(Optional) Run the Backend Server:**
   In a separate terminal, start the Express server if you don't want to use the client-direct mode.
   You can add a script to `package.json` or run it directly:
   ```bash
   node server/index.js
   ```
   *The server runs on `http://localhost:3001`.*

## Scripts
Orphan and utility scripts have been moved to the `scripts/` directory for cleanliness.
- `scripts/find-ops.js` — Scratch pad for Vertex API ops.
- `scripts/test-veo-poll.js` — Scratch pad for testing Veo video generation polling.
