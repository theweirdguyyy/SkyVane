import { NextResponse } from "next/server";

// WMO Weather code → text mapping (inline to avoid importing React component in API route)
function getWeatherDetails(code) {
  if (code === 0) return { text: "Sunny" };
  if (code === 1 || code === 2) return { text: "Partly Cloudy" };
  if (code === 3) return { text: "Overcast" };
  if (code === 45 || code === 48) return { text: "Foggy" };
  if ([51, 53, 55, 56, 57, 61, 80].includes(code)) return { text: "Light Rain" };
  if ([63, 65, 66, 67, 81, 82].includes(code)) return { text: "Heavy Rain" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { text: "Snow" };
  if ([95, 96, 99].includes(code)) return { text: "Thunderstorm" };
  return { text: "Clear" };
}

const API_KEY = process.env.WEATHER_AI_API_KEY;
const BASE_URL = "https://api.weather-ai.co";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Latitude and longitude parameters are required" },
      { status: 400 }
    );
  }

  if (!API_KEY) {
    console.error("WEATHER_AI_API_KEY is not set");
    return NextResponse.json(
      { error: "Weather service is not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${BASE_URL}/v1/weather?lat=${lat}&lon=${lon}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
        cache: "no-store", // Always fetch fresh data - never cache
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Weather-AI API error:", response.status, errBody);
      throw new Error(`Weather API returned ${response.status}`);
    }

    const data = await response.json();

    // ─── PROCESS CURRENT CONDITIONS ─────────────────────────────
    const c = data.current;
    const dailyToday = data.daily?.[0];
    const allHourly = data.hourly ?? [];

    // Find the current hour's entry in hourly data to fill in any missing fields
    const now = new Date();
    const currentHourISO = now.toISOString().slice(0, 13); // e.g. "2026-06-06T09"
    let currentHourIdx = allHourly.findIndex((h) => h.time.startsWith(currentHourISO));
    if (currentHourIdx === -1) currentHourIdx = 0;
    const currentHour = allHourly[currentHourIdx] ?? {};

    // Helper: prefer current block value, fall back to current hour hourly value
    const fromCurrent = (key, fallbackKey) =>
      c?.[key] !== undefined && c?.[key] !== null
        ? c[key]
        : currentHour?.[fallbackKey ?? key];

    // Map condition_code (string) to our icon/text system
    const conditionCode = parseInt(c.condition_code ?? currentHour.condition_code, 10);
    const currentDetails = getWeatherDetails(conditionCode);

    const feelsLike = fromCurrent("feels_like", "feels_like");
    const humidity = fromCurrent("humidity", "humidity");
    const windSpeed = fromCurrent("wind_speed", "wind_speed");
    const windGust = fromCurrent("wind_gust", "wind_gust");
    const uvIndex = fromCurrent("uv_index", "uv_index");
    const visibility = fromCurrent("visibility", "visibility");
    const pressure = fromCurrent("pressure", "pressure");
    const dewPoint = fromCurrent("dew_point", "dew_point");

    const current = {
      temp: Math.round(fromCurrent("temperature", "temperature") ?? 0),
      feelsLike: feelsLike !== undefined && feelsLike !== null ? Math.round(feelsLike) : null,
      humidity: humidity ?? null,
      windSpeed: windSpeed !== undefined ? Math.round(windSpeed) : 0,
      windGust: windGust !== undefined ? Math.round(windGust) : (windSpeed !== undefined ? Math.round(windSpeed) : 0),
      weatherCode: conditionCode,
      conditionText: currentDetails.text,
      uvIndex: uvIndex !== undefined && uvIndex !== null ? Number(uvIndex).toFixed(1) : "N/A",
      visibility: visibility !== undefined && visibility !== null ? `${Math.round(visibility * 10) / 10} km` : "N/A",
      pressure: pressure !== undefined && pressure !== null ? `${Math.round(pressure)} hPa` : "N/A",
      dewPoint: dewPoint !== undefined && dewPoint !== null ? Math.round(dewPoint) : null,
      sunrise: dailyToday?.sunrise ? dailyToday.sunrise.slice(11, 16) : "--:--",
      sunset: dailyToday?.sunset ? dailyToday.sunset.slice(11, 16) : "--:--",
      iconUrl: c.icon ?? currentHour.icon,
    };

    // ─── PROCESS HOURLY FORECAST (Next 8 Hours) ──────────────────
    let startIdx = currentHourIdx;

    const hourly = allHourly.slice(startIdx, startIdx + 8).map((h, i) => ({
      time: i === 0 ? "Now" : h.time.slice(11, 16),
      temp: Math.round(h.temperature),
      feelsLike: h.feels_like !== undefined ? Math.round(h.feels_like) : null,
      humidity: h.humidity ?? null,
      weatherCode: parseInt(h.condition_code, 10),
      iconUrl: h.icon,
      precipProb: h.precipitation_probability ?? 0,
      windSpeed: h.wind_speed !== undefined ? Math.round(h.wind_speed) : 0,
      uvIndex: h.uv_index !== undefined ? Number(h.uv_index).toFixed(1) : "N/A",
    }));

    // ─── PROCESS DAILY FORECAST (7 Days) ─────────────────────────
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const daily = (data.daily ?? []).map((d, i) => {
      const code = parseInt(d.condition_code, 10);
      const details = getWeatherDetails(code);

      let dayLabel;
      if (i === 0) {
        dayLabel = "Today";
      } else {
        const [y, mo, day] = d.date.split("-").map(Number);
        const dateObj = new Date(y, mo - 1, day);
        dayLabel = daysOfWeek[dateObj.getDay()];
      }

      return {
        day: dayLabel,
        condition: details.text,
        weatherCode: code,
        hi: Math.round(d.temp_max),
        lo: Math.round(d.temp_min),
        precipProb: d.precipitation_probability ?? 0,
        precipSum: d.precipitation_sum ?? 0,
        windMax: Math.round(d.wind_max) ?? 0,
        iconUrl: d.icon,
        sunrise: d.sunrise ? d.sunrise.slice(11, 16) : "--:--",
        sunset: d.sunset ? d.sunset.slice(11, 16) : "--:--",
      };
    });

    return NextResponse.json({ current, hourly, daily });
  } catch (error) {
    console.error("Weather Route Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data. Please try again." },
      { status: 500 }
    );
  }
}
