# SkyVane — Elegant Weather Dashboard

SkyVane is a beautiful, responsive, and dynamic weather dashboard built with Next.js. It provides real-time weather data, an interactive 7-day forecast, hourly condition tracking, and a specialized "Event Planner" tool to assess weather risks for outdoor activities. 

With both dark and light themes and smooth micro-animations, SkyVane focuses on delivering a premium user experience.



## Features

- **Live Weather Data:** Accurate real-time conditions including temperature, "feels like", humidity, wind speed/gusts, UV index, visibility, and more.
- **Dynamic Location Search:** Search for any city worldwide with autocomplete suggestions.
- **7-Day Forecast & Hourly Tracking:** Detailed upcoming weather patterns.
- **Event Planner Tool:** Select an upcoming event (Wedding, Hike, Picnic, etc.) and get an automated risk assessment based on the forecast.
- **Dark/Light Mode:** Seamlessly toggle between a deep, immersive dark theme and a clean, bright light theme.
- **Responsive Design:** Fully optimized for both desktop and mobile devices.
- **Animated Icons:** Custom SVG weather icons with smooth CSS animations (rotating suns, drifting clouds, falling rain).

## Technologies Used

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **UI Library:** [React](https://reactjs.org/)
- **Styling:** Vanilla CSS with custom CSS variables for theming and animations
- **Weather API:** [Weather-AI API](https://api.weather-ai.co)
- **Geocoding API:** [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) (for location search)

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- npm (or yarn/pnpm)
- A free API key from [Weather-AI](https://api.weather-ai.co)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/theweirdguyyy/SkyVane.git
   cd SkyVane
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy the `.env.example` file to create a new `.env.local` file:
     ```bash
     cp .env.example .env.local
     ```
   - Open `.env.local` and add your Weather-AI API key:
     ```env
     WEATHER_AI_API_KEY=your_actual_api_key_here
     ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser to see the dashboard in action.

## Building for Production

To create an optimized production build:

```bash
npm run build
npm start
```

## License

This project is licensed under the MIT License.
