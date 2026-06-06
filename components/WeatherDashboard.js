"use client";

import { useState, useEffect, useRef } from "react";
import WeatherIcon from "./WeatherIcon";
import Particles from "./Particles";

const toFahrenheit = (c) => Math.round((c * 9) / 5 + 32);

export default function WeatherDashboard() {
  const [city, setCity] = useState({
    name: "Dhaka",
    country: "Bangladesh",
    countryCode: "BD",
    lat: 23.7104,
    lon: 90.4074,
  });

  // The API requires lat/lon for specific locations

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search autocomplete state
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const desktopRef = useRef(null);
  const mobileRef = useRef(null);

  // Unit settings: 'C' or 'F'
  const [unit, setUnit] = useState("C");

  // Mobile active tab: 'today' | 'forecast' | 'map' | 'planner' | 'settings'
  const [mobileTab, setMobileTab] = useState("today");

  // Desktop right panel tab: 'details' | 'planner'
  const [activeRightTab, setActiveRightTab] = useState("details");

  // Event planner state
  const [plannerEventType, setPlannerEventType] = useState("wedding");
  const [plannerDayIndex, setPlannerDayIndex] = useState(0);

  // Theme: 'dark' | 'light'
  const [theme, setTheme] = useState("dark");
  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  // Fetch weather data when city changes
  const fetchWeather = async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Could not load weather data.");
      }
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city.lat, city.lon);
  }, [city.lat, city.lon]);

  // Debounced geocoding search
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const delay = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.results || []);
        }
      } catch (err) {
        console.error("Error loading suggestions:", err);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  // Close suggestions dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      const isClickInsideDesktop = desktopRef.current && desktopRef.current.contains(event.target);
      const isClickInsideMobile = mobileRef.current && mobileRef.current.contains(event.target);
      if (!isClickInsideDesktop && !isClickInsideMobile) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionSelect = (s) => {
    const newCity = {
      name: s.name,
      country: s.country,
      countryCode: s.country_code,
      lat: s.latitude,
      lon: s.longitude,
    };
    setCity(newCity);
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleRetry = () => {
    fetchWeather(city.lat, city.lon);
  };

  // Convert temp based on selected unit
  const formatTemp = (celsiusValue) => {
    if (celsiusValue === undefined || celsiusValue === null) return "--";
    return unit === "C" ? celsiusValue : toFahrenheit(celsiusValue);
  };



  return (
    <div className={theme === "light" ? "light" : ""}>
      <div className="bg-layer" aria-hidden="true"></div>
      <Particles />

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  DESKTOP VIEW                                              */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="app desktop-view">
        {/* Top Bar */}
        <header className="topbar">
          <div className="logo">
            SKY<span>VANE</span>
          </div>
          <SearchInput
            idPrefix="desktop"
            containerRef={desktopRef}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            suggestions={suggestions}
            handleSuggestionSelect={handleSuggestionSelect}
          />
          <div className="unit-toggle">
            <button
              className={`unit-btn ${unit === "C" ? "active" : ""}`}
              id="celsiusBtn"
              onClick={() => setUnit("C")}
            >
              °C
            </button>
            <button
              className={`unit-btn ${unit === "F" ? "active" : ""}`}
              id="fahrenheitBtn"
              onClick={() => setUnit("F")}
            >
              °F
            </button>
          </div>
          {/* Theme toggle */}
          <button
            className="theme-toggle-btn"
            id="themeToggleBtn"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/>
                <line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/>
                <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/>
                <line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>
                <line x1="4.93" y1="19.07" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.07" y2="4.93"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </header>

        {loading ? (
          <div className="loading-wrapper">
            <div className="loading-spinner"></div>
            <p className="loading-text">Retrieving forecast data...</p>
          </div>
        ) : error ? (
          <div className="error-wrapper">
            <p className="error-title">Unable to load forecast</p>
            <p className="error-msg">{error}</p>
            <button className="retry-btn" onClick={handleRetry}>
              Retry Fetch
            </button>
          </div>
        ) : (
          <main className="panels">
            {/* LEFT: Current conditions */}
            <section className="panel-left">
              <div>
                <p className="city-name">{city.name}</p>
                <p className="city-country">
                  {city.country} · {city.countryCode}
                </p>

                <div className="temp-display">
                  <span className="temp-number" id="mainTemp">
                    {formatTemp(weather.current.temp)}
                  </span>
                  <span className="temp-unit">°</span>
                </div>
                <p className="condition-text">{weather.current.conditionText}</p>

                <div className="weather-icon-area">
                  <WeatherIcon code={weather.current.weatherCode} isMain={true} />
                </div>
              </div>

              <div className="stats-row">
                <div className="stat-item">
                  <span className="stat-label">Feels like</span>
                  <span className="stat-value" id="feelsVal">
                    {formatTemp(weather.current.feelsLike)}°
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Humidity</span>
                  <span className="stat-value">{weather.current.humidity}%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Wind</span>
                  <span className="stat-value">{weather.current.windSpeed} km/h</span>
                </div>
              </div>
            </section>

            {/* CENTER: 7-day forecast */}
            <section className="panel-center">
              <p className="section-title">7-Day Forecast</p>
              <div className="forecast-list">
                {weather.daily.map((item, idx) => (
                  <div key={idx} className={`fc-card ${idx === 0 ? "today" : ""}`}>
                    <span className={`fc-day ${idx === 0 ? "today-label" : ""}`}>
                      {item.day}
                    </span>
                    <span className="fc-condition">{item.condition}</span>
                    <WeatherIcon code={item.weatherCode} />
                    <div className="fc-temps">
                      <div className="fc-hi">{formatTemp(item.hi)}°</div>
                      <div className="fc-lo">{formatTemp(item.lo)}°</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* RIGHT: Details / Planner */}
            <section className="panel-right">
              <div className="panel-tabs">
                <button
                  className={`tab-btn ${activeRightTab === "details" ? "active" : ""}`}
                  onClick={() => setActiveRightTab("details")}
                >
                  Weather Details
                </button>
                <button
                  className={`tab-btn ${activeRightTab === "planner" ? "active" : ""}`}
                  onClick={() => setActiveRightTab("planner")}
                >
                  Event Planner
                </button>
              </div>

              {activeRightTab === "details" ? (
                <>
                  <div className="detail-block">
                    <p className="detail-label">UV Index</p>
                    <p className="detail-value amber">{weather.current.uvIndex}</p>
                    <p className="detail-sub">Current · SPF recommended</p>
                  </div>

                  <div className="detail-block">
                    <p className="detail-label">Wind Gust</p>
                    <p className="detail-value">{weather.current.windGust} km/h</p>
                    <p className="detail-sub">Peak gust speed</p>
                  </div>

                  <div className="detail-block">
                    <p className="detail-label">Rain Chance</p>
                    <p className="detail-value">{weather.daily[0]?.precipProb ?? 0}%</p>
                    <p className="detail-sub">Precipitation probability</p>
                  </div>

                  <div className="detail-block">
                    <p className="detail-label">Hi / Lo Today</p>
                    <p className="detail-value">{formatTemp(weather.daily[0]?.hi)}° / {formatTemp(weather.daily[0]?.lo)}°</p>
                    <p className="detail-sub">Today&apos;s temperature range</p>
                  </div>

                  <div className="detail-block">
                    <p className="detail-label">Visibility</p>
                    <p className="detail-value">{weather.current.visibility}</p>
                    <p className="detail-sub">Atmospheric visibility</p>
                  </div>

                  <div className="detail-block">
                    <p className="detail-label">Pressure</p>
                    <p className="detail-value">{weather.current.pressure}</p>
                    <p className="detail-sub">Barometric pressure</p>
                  </div>

                  <div className="detail-block">
                    <p className="detail-label">Dew Point</p>
                    <p className="detail-value">{weather.current.dewPoint !== null ? `${formatTemp(weather.current.dewPoint)}°` : "N/A"}</p>
                    <p className="detail-sub">Moisture comfort</p>
                  </div>

                  <div className="detail-block">
                    <p className="detail-label">Sunrise / Sunset</p>
                    <div className="sun-row">
                      <div className="sun-item">
                        <p className="sun-label">↑ Rise</p>
                        <p className="sun-time">{weather.current.sunrise}</p>
                      </div>
                      <div className="sun-item">
                        <p className="sun-label">↓ Set</p>
                        <p className="sun-time">{weather.current.sunset}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <EventPlannerPanel
                  weather={weather}
                  unit={unit}
                  plannerEventType={plannerEventType}
                  setPlannerEventType={setPlannerEventType}
                  plannerDayIndex={plannerDayIndex}
                  setPlannerDayIndex={setPlannerDayIndex}
                />
              )}
            </section>
          </main>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  MOBILE VIEW                                               */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="mobile-view">
        <div className="m-scroll-content">
          {/* Mobile top bar */}
          <div className="m-topbar">
            <div className="m-logo">
              SKY<span>VANE</span>
            </div>
            <div className="m-toggle">
              <button
                className={`m-unit-btn ${unit === "C" ? "active" : ""}`}
                onClick={() => setUnit("C")}
              >
                °C
              </button>
              <button
                className={`m-unit-btn ${unit === "F" ? "active" : ""}`}
                onClick={() => setUnit("F")}
              >
                °F
              </button>
            </div>
            {/* Mobile theme toggle */}
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4"/>
                  <line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/>
                  <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/>
                  <line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>
                  <line x1="4.93" y1="19.07" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.07" y2="4.93"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>

          {/* Mobile search */}
          <div className="m-search-container">
            <SearchInput
              idPrefix="mobile"
              containerRef={mobileRef}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              showSuggestions={showSuggestions}
              setShowSuggestions={setShowSuggestions}
              suggestions={suggestions}
              handleSuggestionSelect={handleSuggestionSelect}
            />
          </div>

          {loading ? (
            <div className="loading-wrapper">
              <div className="loading-spinner"></div>
              <p className="loading-text">Retrieving forecast data...</p>
            </div>
          ) : error ? (
            <div className="error-wrapper">
              <p className="error-title">Unable to load forecast</p>
              <p className="error-msg">{error}</p>
              <button className="retry-btn" onClick={handleRetry}>
                Retry Fetch
              </button>
            </div>
          ) : (
            <>
              {/* TAB 1: TODAY */}
              {mobileTab === "today" && (
                <div className="m-section-group fade-in-tab">
                  {/* Hero */}
                  <div className="m-hero">
                    <p className="m-city">
                      {city.name}, {city.country}
                    </p>
                    <div className="m-temp-row">
                      <span className="m-temp" id="mMainTemp">
                        {formatTemp(weather.current.temp)}
                      </span>
                      <span className="m-unit">°</span>
                    </div>
                    <p className="m-condition">{weather.current.conditionText}</p>
                    <div className="m-icon-area">
                      <WeatherIcon code={weather.current.weatherCode} isMain={true} />
                    </div>
                  </div>

                  {/* Hourly forecast */}
                  <div className="m-section">
                    <p className="m-section-title">Hourly forecast</p>
                    <div className="hourly-scroll">
                      {weather.hourly.map((h, index) => (
                        <div
                          key={index}
                          className={`hour-card ${h.time === "Now" ? "now-card" : ""}`}
                        >
                          <div className={`hour-time ${h.time === "Now" ? "now-t" : ""}`}>
                            {h.time}
                          </div>
                          <WeatherIcon code={h.weatherCode} className="hour-icon" />
                          <div className="hour-temp">{formatTemp(h.temp)}°</div>
                          {h.precipProb > 0 && (
                            <div className="hour-precip">{h.precipProb}%</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Conditions stats */}
                  <div className="m-section">
                    <p className="m-section-title">Current Stats</p>
                    <div className="m-stats-grid">
                      <div className="m-stat-card">
                        <p className="m-stat-label">Feels Like</p>
                        <p className="m-stat-val">{formatTemp(weather.current.feelsLike)}°</p>
                      </div>
                      <div className="m-stat-card">
                        <p className="m-stat-label">Wind</p>
                        <p className="m-stat-val">{weather.current.windSpeed} km/h</p>
                      </div>
                      <div className="m-stat-card">
                        <p className="m-stat-label">Humidity</p>
                        <p className="m-stat-val">{weather.current.humidity}%</p>
                      </div>
                      <div className="m-stat-card">
                        <p className="m-stat-label">Dew Point</p>
                        <p className="m-stat-val">{formatTemp(weather.current.dewPoint)}°</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: FORECAST */}
              {mobileTab === "forecast" && (
                <div className="m-section fade-in-tab">
                  <p className="m-section-title">7-Day Forecast</p>
                  <div className="m-fc-list">
                    {weather.daily.map((item, idx) => (
                      <div key={idx} className="m-fc-row">
                        <span className={`m-fc-day ${idx === 0 ? "today" : ""}`}>
                          {item.day}
                        </span>
                        <WeatherIcon code={item.weatherCode} className="m-fc-icon" />
                        <div className="m-hi">{formatTemp(item.hi)}°</div>
                        <div className="m-lo">{formatTemp(item.lo)}°</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: MAP */}
              {mobileTab === "map" && (
                <div className="m-section fade-in-tab">
                  <p className="m-section-title">Precipitation Radar</p>
                  <div className="map-placeholder">
                    <div className="map-grid"></div>
                    <div className="map-radar"></div>
                    <div className="map-dot"></div>
                    <span
                      style={{
                        position: "relative",
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        color: "var(--accent-ice)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      SCANNING dhk_radial_0{city.countryCode}...
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 5: PLANNER */}
              {mobileTab === "planner" && (
                <div className="m-planner-wrap fade-in-tab">
                  <p className="m-section-title">Event Planner</p>
                  <EventPlannerPanel
                    weather={weather}
                    unit={unit}
                    plannerEventType={plannerEventType}
                    setPlannerEventType={setPlannerEventType}
                    plannerDayIndex={plannerDayIndex}
                    setPlannerDayIndex={setPlannerDayIndex}
                  />
                </div>
              )}

              {/* TAB 4: SETTINGS */}
              {mobileTab === "settings" && (
                <div className="m-section fade-in-tab">
                  <p className="m-section-title">System Settings</p>
                  <div className="settings-list">
                    <div className="settings-card">
                      <div>
                        <p className="settings-card-label">Measurement Scale</p>
                        <p className="settings-card-sub">Select preferred units</p>
                      </div>
                      <div className="m-toggle">
                        <button
                          className={`m-unit-btn ${unit === "C" ? "active" : ""}`}
                          onClick={() => setUnit("C")}
                        >
                          °C
                        </button>
                        <button
                          className={`m-unit-btn ${unit === "F" ? "active" : ""}`}
                          onClick={() => setUnit("F")}
                        >
                          °F
                        </button>
                      </div>
                    </div>

                    <div className="settings-card">
                      <div>
                        <p className="settings-card-label">Active Station</p>
                        <p className="settings-card-sub">
                          {city.name}, {city.country}
                        </p>
                      </div>
                      <span
                        style={{
                          fontSize: "10px",
                          fontFamily: "var(--font-mono)",
                          color: "var(--text-muted)",
                        }}
                      >
                        {city.lat.toFixed(2)}N, {city.lon.toFixed(2)}E
                      </span>
                    </div>

                    <div className="settings-card">
                      <div>
                        <p className="settings-card-label">Atmosphere Details</p>
                        <p className="settings-card-sub">UV: {weather.current.uvIndex} · Gust: {weather.current.windGust} km/h</p>
                      </div>
                    </div>

                    <div className="settings-card">
                      <div>
                        <p className="settings-card-label">Skyvane Version</p>
                        <p className="settings-card-sub">v2.0.0 (Full-Stack Next.js)</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom nav */}
        <nav className="m-bottom-nav">
          <button
            className="m-nav-item"
            type="button"
            onClick={() => setMobileTab("today")}
          >
            <svg
              className={`m-nav-icon ${mobileTab === "today" ? "active" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
            </svg>
            <span className={`m-nav-label ${mobileTab === "today" ? "active" : ""}`}>
              Today
            </span>
            {mobileTab === "today" && <div className="m-nav-dot"></div>}
          </button>

          <button
            className="m-nav-item"
            type="button"
            onClick={() => setMobileTab("forecast")}
          >
            <svg
              className={`m-nav-icon ${mobileTab === "forecast" ? "active" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className={`m-nav-label ${mobileTab === "forecast" ? "active" : ""}`}>
              Forecast
            </span>
            {mobileTab === "forecast" && <div className="m-nav-dot"></div>}
          </button>

          <button
            className="m-nav-item"
            type="button"
            onClick={() => setMobileTab("map")}
          >
            <svg
              className={`m-nav-icon ${mobileTab === "map" ? "active" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" y1="3" x2="9" y2="18" />
              <line x1="15" y1="6" x2="15" y2="21" />
            </svg>
            <span className={`m-nav-label ${mobileTab === "map" ? "active" : ""}`}>
              Map
            </span>
            {mobileTab === "map" && <div className="m-nav-dot"></div>}
          </button>

          <button
            className="m-nav-item"
            type="button"
            onClick={() => setMobileTab("planner")}
          >
            <svg
              className={`m-nav-icon ${mobileTab === "planner" ? "active" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <path d="M9 16l2 2 4-4" />
            </svg>
            <span className={`m-nav-label ${mobileTab === "planner" ? "active" : ""}`}>
              Planner
            </span>
            {mobileTab === "planner" && <div className="m-nav-dot"></div>}
          </button>

          <button
            className="m-nav-item"
            type="button"
            onClick={() => setMobileTab("settings")}
          >
            <svg
              className={`m-nav-icon ${mobileTab === "settings" ? "active" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07" />
            </svg>
            <span className={`m-nav-label ${mobileTab === "settings" ? "active" : ""}`}>
              Settings
            </span>
            {mobileTab === "settings" && <div className="m-nav-dot"></div>}
          </button>
        </nav>
      </div>
    </div>
  );
}

function SearchInput({
  idPrefix,
  containerRef,
  searchTerm,
  setSearchTerm,
  showSuggestions,
  setShowSuggestions,
  suggestions,
  handleSuggestionSelect,
}) {
  return (
    <div className="search-wrap" ref={containerRef}>
      <input
        className="search-input"
        type="text"
        placeholder="Search city or region..."
        id={`${idPrefix}SearchInput`}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
      />
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-dropdown">
          {suggestions.map((s, index) => (
            <li key={s.id || index}>
              <button
                className="suggestion-item"
                type="button"
                onClick={() => handleSuggestionSelect(s)}
              >
                {s.name}
                {s.admin1 ? `, ${s.admin1}` : ""}
                <span className="country">
                  {s.country_code ? s.country_code : s.country}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  EVENT RISK EVALUATION ENGINE
// ═══════════════════════════════════════════════════════════
const evaluateEventRisk = (dayData, eventType, unit) => {
  if (!dayData) return null;

  const tempMaxC = dayData.hi;
  const tempMinC = dayData.lo;
  const precipProb = dayData.precipProb ?? 0;
  const precipSum = dayData.precipSum ?? 0;
  const windMax = dayData.windMax ?? 0;
  const weatherCode = dayData.weatherCode ?? 3;

  const formatTempStr = (c) => {
    return unit === "C" ? `${c}°C` : `${Math.round((c * 9) / 5 + 32)}°F`;
  };

  let status = "green";
  let summary = "Optimal conditions! The weather is perfectly aligned for your event.";
  let warnings = [];

  const isStorm = [95, 96, 99].includes(weatherCode);
  const isSnow = [71, 73, 75, 77, 85, 86].includes(weatherCode);
  const isHeavyRain = [63, 65, 66, 67, 81, 82].includes(weatherCode);

  switch (eventType) {
    case "wedding":
      if (isStorm) {
        status = "red";
        warnings.push("⚡ Thunderstorms forecasted! High danger of lightning and sudden downpours.");
      } else if (isSnow) {
        status = "red";
        warnings.push("❄️ Snowfall expected. Extremely risky for outdoor ceremonies.");
      } else if (precipProb > 50 || precipSum > 5 || isHeavyRain) {
        status = "red";
        warnings.push(`🌧️ High rain probability (${precipProb}%) with ${precipSum}mm total. Indoor backup is mandatory.`);
      } else if (windMax > 30) {
        status = "red";
        warnings.push(`💨 Critical winds (up to ${windMax} km/h). Canopies, tents, and floral arches will not be secure.`);
      } else if (tempMaxC > 34) {
        status = "red";
        warnings.push(`🥵 Extreme heat warning (High of ${formatTempStr(tempMaxC)}). Guests will experience severe discomfort.`);
      } else if (tempMinC < 8) {
        status = "red";
        warnings.push(`🥶 Extreme cold warning (Low of ${formatTempStr(tempMinC)}). Indoor heating/venue required.`);
      } else {
        if (precipProb > 20 || precipSum > 1) {
          status = "yellow";
          warnings.push(`🌦️ Slight rain risk (${precipProb}% chance). Consider setting up tents or umbrellas.`);
        }
        if (windMax > 18 && windMax <= 30) {
          status = "yellow";
          warnings.push(`🍃 Fresh breeze (${windMax} km/h). Secure lightweight decorations and drapery.`);
        }
        if (tempMaxC >= 30 && tempMaxC <= 34) {
          status = "yellow";
          warnings.push(`☀️ Very warm (High of ${formatTempStr(tempMaxC)}). Provide cold beverages and shaded areas.`);
        }
        if (tempMinC >= 8 && tempMinC < 13) {
          status = "yellow";
          warnings.push(`🧣 Cool evening expected (Low of ${formatTempStr(tempMinC)}). Outdoor heaters or blankets recommended.`);
        }
      }
      if (status === "green") {
        summary = "Favorable, clear skies! Ideal for a beautiful outdoor ceremony and reception.";
      } else if (status === "yellow") {
        summary = "Mostly good, but minor adjustments/backups are advised to keep guests comfortable.";
      } else {
        summary = "High risk of event disruption. An indoor venue or postponement is strongly recommended.";
      }
      break;

    case "sports":
      if (isStorm) {
        status = "red";
        warnings.push("⚡ Severe thunderstorms predicted. Outdoor sports must be suspended for safety.");
      } else if (isSnow) {
        status = "red";
        warnings.push("❄️ Snow/slush accumulation on courts/fields makes play highly unsafe.");
      } else if (windMax > 45) {
        status = "red";
        warnings.push(`💨 Gale-force wind gusts (${windMax} km/h). Ball tracking and field conditions compromised.`);
      } else if (precipSum > 15 || isHeavyRain) {
        status = "red";
        warnings.push(`🌧️ Heavy rainfall (${precipSum}mm) will cause field flooding/waterlogging.`);
      } else if (tempMaxC > 38) {
        status = "red";
        warnings.push(`🥵 Dangerously hot (High of ${formatTempStr(tempMaxC)}). High risk of heat stroke/dehydration.`);
      } else {
        if (precipProb > 40) {
          status = "yellow";
          warnings.push(`🌦️ Moderate rain risk (${precipProb}% chance). Field traction could become slippery.`);
        }
        if (windMax > 25 && windMax <= 45) {
          status = "yellow";
          warnings.push(`💨 High winds (${windMax} km/h). Will significantly impact flight-based sports (tennis, badminton).`);
        }
        if (tempMaxC >= 32 && tempMaxC <= 38) {
          status = "yellow";
          warnings.push(`☀️ High temperature (High of ${formatTempStr(tempMaxC)}). Schedule frequent hydration breaks.`);
        }
        if (tempMinC < 5) {
          status = "yellow";
          warnings.push(`❄️ Freezing temperatures (Low of ${formatTempStr(tempMinC)}). Players need thermal activewear.`);
        }
      }
      if (status === "green") {
        summary = "Perfect sporting conditions! Firm terrain, moderate temperature, and minimal wind.";
      } else if (status === "yellow") {
        summary = "Playable, but players and organizers should adapt to temperature/wind shifts.";
      } else {
        summary = "Unplayable/unsafe conditions. Match cancellation or postponement is advised.";
      }
      break;

    case "beach":
      if (isStorm) {
        status = "red";
        warnings.push("⚡ Thunderstorm danger. Keep away from water bodies and open beaches.");
      } else if (tempMaxC < 20) {
        status = "red";
        warnings.push(`🥶 Too cold for beach activities (High of ${formatTempStr(tempMaxC)}).`);
      } else if (precipProb > 40 || precipSum > 3) {
        status = "red";
        warnings.push(`🌧️ Overcast with rain expected (${precipProb}% chance). Not suitable for sunbathing/swimming.`);
      } else if (windMax > 35) {
        status = "red";
        warnings.push(`💨 High winds (${windMax} km/h) causing strong currents and rough seas.`);
      } else {
        if (precipProb > 15 && precipProb <= 40) {
          status = "yellow";
          warnings.push(`🌦️ Scattered showers possible. Pack quick-dry gear.`);
        }
        if (tempMaxC >= 20 && tempMaxC < 24) {
          status = "yellow";
          warnings.push(`⛅ Mild weather (High of ${formatTempStr(tempMaxC)}). Water temperature may feel cool.`);
        }
        if (windMax > 20 && windMax <= 35) {
          status = "yellow";
          warnings.push(`🍃 Moderate sea breeze (${windMax} km/h). Watch out for flying sand.`);
        }
      }
      if (status === "green") {
        summary = "Gorgeous beach day! Blue skies, warm temperatures, and calm winds.";
      } else if (status === "yellow") {
        summary = "Sub-optimal beach weather. Suitable for walks, but maybe not sunbathing or swimming.";
      } else {
        summary = "Unsuitable beach weather. Reschedule or plan indoor water activities.";
      }
      break;

    case "bbq":
      if (isStorm) {
        status = "red";
        warnings.push("⚡ Storm threat! Open fires and outdoor gas grills are highly dangerous under lightning.");
      } else if (precipProb > 45 || precipSum > 3 || isHeavyRain) {
        status = "red";
        warnings.push(`🌧️ High chance of rain. Damp conditions will ruin food preparation and seating.`);
      } else if (windMax > 35) {
        status = "red";
        warnings.push(`💨 Strong wind gusts (${windMax} km/h). Sparks/coals will blow, presenting a fire hazard.`);
      } else if (tempMaxC > 36 || tempMinC < 8) {
        status = "red";
        warnings.push(`🌡️ Extreme temperature bounds (${formatTempStr(tempMinC)} to ${formatTempStr(tempMaxC)}). Intolerable for dining.`);
      } else {
        if (precipProb > 20 && precipProb <= 45) {
          status = "yellow";
          warnings.push(`🌦️ Passing showers possible. Setup grill under a ventilated gazebo or awning.`);
        }
        if (windMax > 18 && windMax <= 35) {
          status = "yellow";
          warnings.push(`🍃 Fresh breeze (${windMax} km/h). Keep food containers weighted and secure napkins.`);
        }
        if (tempMaxC >= 30 && tempMaxC <= 36) {
          status = "yellow";
          warnings.push(`☀️ Warm day. Keep perishable meats/salads iced in coolers.`);
        }
      }
      if (status === "green") {
        summary = "Perfect barbecue conditions! Gentle breeze, warm sun, and clear skies.";
      } else if (status === "yellow") {
        summary = "Good to go, but secure paper items and keep an eye on quick-developing clouds.";
      } else {
        summary = "Outdoor dining cancelled. Move the barbecue/picnic indoors or to a shelter.";
      }
      break;

    case "concert":
      if (isStorm) {
        status = "red";
        warnings.push("⚡ Severe storm risk. Electrical sound equipment and stage lighting present electrocution hazards.");
      } else if (windMax > 40) {
        status = "red";
        warnings.push(`💨 High wind warning (${windMax} km/h). Outdoor rigging, video walls, and speaker lines are unsafe.`);
      } else if (precipSum > 10 || isHeavyRain) {
        status = "red";
        warnings.push(`🌧️ Substantial rain forecast (${precipSum}mm). Muddy conditions and staging complications.`);
      } else if (tempMinC < 4) {
        status = "red";
        warnings.push(`❄️ Freezing temperatures overnight. Unsafe for crowds standing outdoors.`);
      } else {
        if (precipProb > 30) {
          status = "yellow";
          warnings.push(`🌦️ Light rain risk (${precipProb}% chance). Advise attendees to bring ponchos (no umbrellas allowed).`);
        }
        if (windMax > 22 && windMax <= 40) {
          status = "yellow";
          warnings.push(`🍃 Wind gusts of ${windMax} km/h. Audio projection might be distorted or drifting.`);
        }
      }
      if (status === "green") {
        summary = "Excellent concert weather! Clear acoustics, dry skies, and comfortable breeze.";
      } else if (status === "yellow") {
        summary = "Show will go on! Remind attendees to pack jackets or rain protection.";
      } else {
        summary = "Outdoor concert suspended. High safety risks for equipment and crowds.";
      }
      break;

    case "hiking":
      if (isStorm) {
        status = "red";
        warnings.push("⚡ Thunderstorms on trails. Extremely dangerous on high ridges, peaks, or near tall trees.");
      } else if (isSnow) {
        status = "red";
        warnings.push("❄️ Snowfall/ice on routes. Requires specialized gear (microspikes/crampons) and navigation skills.");
      } else if (precipSum > 8 || isHeavyRain) {
        status = "red";
        warnings.push(`🌧️ Rainfall levels (${precipSum}mm) will trigger muddy trails, slick rocks, and high creek crossings.`);
      } else if (tempMinC < 0) {
        status = "red";
        warnings.push("❄️ Sub-zero freeze danger. High risk of hypothermia for unprepared hikers.");
      } else if (windMax > 45) {
        status = "red";
        warnings.push(`💨 Dangerously high winds (${windMax} km/h) on exposed ridges and risk of falling branches.`);
      } else {
        if (precipProb > 30) {
          status = "yellow";
          warnings.push(`🌦️ Moderate rain risk (${precipProb}%). Pack full shell jackets and waterproof hiking shoes.`);
        }
        if (windMax > 25 && windMax <= 45) {
          status = "yellow";
          warnings.push(`💨 Strong breeze on summits. Keep windbreakers handy.`);
        }
        if (tempMaxC > 32) {
          status = "yellow";
          warnings.push(`☀️ High temperature. Pack double the water ratio and start trail before sunrise.`);
        }
      }
      if (status === "green") {
        summary = "Perfect hiking conditions! Dry paths, clear vistas, and cool breeze.";
      } else if (status === "yellow") {
        summary = "Trail is clear, but dress in layers and carry appropriate waterproof/hydration gear.";
      } else {
        summary = "Severe trail conditions. Postpone the hike or switch to lower forested routes.";
      }
      break;

    default:
      break;
  }

  return { status, summary, warnings };
};

// ═══════════════════════════════════════════════════════════
//  EVENT PLANNER PANEL COMPONENT
// ═══════════════════════════════════════════════════════════
function EventPlannerPanel({
  weather,
  unit,
  plannerEventType,
  setPlannerEventType,
  plannerDayIndex,
  setPlannerDayIndex,
}) {
  if (!weather || !weather.daily) return null;

  const eventTypes = [
    { id: "wedding", name: "💍 Outdoor Wedding" },
    { id: "sports", name: "⚽ Sports Tournament" },
    { id: "bbq", name: "🍔 Barbecue / Picnic" },
    { id: "beach", name: "🏖️ Beach & Swim Day" },
    { id: "concert", name: "🎵 Outdoor Concert" },
    { id: "hiking", name: "🥾 Hiking & Trekking" },
  ];

  const targetDay = weather.daily[plannerDayIndex];
  const evaluation = evaluateEventRisk(targetDay, plannerEventType, unit);

  const maxTempStr = unit === "C" ? `${targetDay.hi}°C` : `${Math.round((targetDay.hi * 9) / 5 + 32)}°F`;
  const minTempStr = unit === "C" ? `${targetDay.lo}°C` : `${Math.round((targetDay.lo * 9) / 5 + 32)}°F`;

  return (
    <div className="planner-container">
      <div className="planner-form">
        <div className="form-group">
          <label htmlFor="eventTypeSelect">Event Profile</label>
          <select
            id="eventTypeSelect"
            className="planner-select"
            value={plannerEventType}
            onChange={(e) => setPlannerEventType(e.target.value)}
          >
            {eventTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="eventDateSelect">Event Date</label>
          <select
            id="eventDateSelect"
            className="planner-select"
            value={plannerDayIndex}
            onChange={(e) => setPlannerDayIndex(Number(e.target.value))}
          >
            {weather.daily.map((day, index) => (
              <option key={index} value={index}>
                {day.day} ({day.condition})
              </option>
            ))}
          </select>
        </div>
      </div>

      {evaluation && (
        <div className={`risk-card ${evaluation.status}`}>
          <div className="risk-header">
            <span className="risk-badge">
              {evaluation.status} Rating
            </span>
            <div className="risk-light">
              <span className="light-dot"></span>
              {evaluation.status.toUpperCase()} LIGHT
            </div>
          </div>

          <p className="risk-summary">{evaluation.summary}</p>

          {evaluation.warnings.length > 0 ? (
            <div className="risk-warnings">
              {evaluation.warnings.map((warning, idx) => (
                <div key={idx} className="warning-item">
                  <span>{warning}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="risk-warnings">
              <div className="warning-item" style={{ color: '#34d399' }}>
                <span>✨ No hazardous weather warnings for this activity profile. Enjoy your event!</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="planner-metrics">
        <div className="p-metric-card">
          <span className="p-metric-label">Temp Max</span>
          <span className="p-metric-val">{maxTempStr}</span>
          <span className="p-metric-sub">Min: {minTempStr}</span>
        </div>

        <div className="p-metric-card">
          <span className="p-metric-label">Wind Max</span>
          <span className="p-metric-val">{targetDay.windMax} km/h</span>
          <span className="p-metric-sub">Peak speed</span>
        </div>

        <div className="p-metric-card">
          <span className="p-metric-label">Rain Chance</span>
          <span className="p-metric-val">{targetDay.precipProb}%</span>
          <span className="p-metric-sub">Probability</span>
        </div>

        <div className="p-metric-card">
          <span className="p-metric-label">Rain Sum</span>
          <span className="p-metric-val">{targetDay.precipSum} mm</span>
          <span className="p-metric-sub">Accumulation</span>
        </div>
      </div>
    </div>
  );
}
