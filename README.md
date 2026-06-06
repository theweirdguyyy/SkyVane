# 🌤️ Skyvane Weather Dashboard

Skyvane is a premium, full-stack weather forecasting dashboard built with **Next.js 14** (App Router) and **Vanilla CSS**. It integrates with the **Weather-AI API** (`https://weather-ai.co`) to deliver real-time meteorological conditions, hourly trends, and a 7-day outlook inside a stunning glassmorphic interface with fluid animations.

---

## ✨ Features

- **Glassmorphic UI**: High-fidelity, premium visual design incorporating blur effects, smooth gradients, and custom layouts.
- **Real-Time Data**: Integrates directly with the **Weather-AI API** (Free Tier `/v1/weather` endpoint) for global city forecast retrievals.
- **Global Search**: Interactive search bar with debounced query suggestions to locate any city or region globally.
- **Unit Scale Toggle**: Smoothly switches temperatures between Celsius (°C) and Fahrenheit (°F) across all sections.
- **Fluid Particle Animations**: Custom floating background particle system that runs smoothly client-side.
- **High-Fidelity Weather Icons**: Dynamic, custom-drawn SVG weather icons mapping WMO weather codes to beautiful, animated meteorological representation.
- **Mobile First Navigation**: A native-feeling tabbed mobile layout with integrated views:
  - **Today**: Current hero statistics, hourly forecasts (next 8 hours), and key conditions.
  - **Forecast**: Compact 7-day meteorological outlook.
  - **Map**: Radial radar animation scanning localized regions.
  - **Settings**: System controls for units, coordinates, and active telemetry stations.

---

## 🚀 Tech Stack

- **Core**: [Next.js 14](https://nextjs.org/) (App Router), [React](https://react.dev/)
- **Styling**: Modern Vanilla CSS with HSL-defined custom variables, responsive design, and CSS transitions
- **API Services**:
  - **Weather-AI API** (`/v1/weather`): For current weather conditions, daily forecasts, and hourly trends.
  - **Geocoding API**: For real-time city suggestions and coordinates lookup.

---

## 🛠️ Getting Started

### 1. Prerequisites
Ensure you have **Node.js** (v18.x or later) installed on your machine.

### 2. Set Up Environment Variables
Sign up at [Weather-AI](https://weather-ai.co) to get your free API key.

Create a `.env.local` file in the root of the project (or copy `.env.example`):
```bash
cp .env.example .env.local
```

Open `.env.local` and add your API key:
```env
WEATHER_AI_API_KEY=your_weather_ai_api_key_here
```

### 3. Install Dependencies
Install all package dependencies using npm:
```bash
npm install
```

### 4. Run Locally
Start the Next.js local development server:
```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Production Build
To compile a production build of the application:
```bash
npm run build
npm start
```
This builds standard Next.js optimized bundles with all Dynamic API routes configured.
