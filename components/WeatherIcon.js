import React from "react";

export function getWeatherDetails(code) {
  if (code === 0) {
    return { text: "Sunny", icon: "sunny" };
  } else if (code === 1 || code === 2) {
    return { text: "Partly Cloudy", icon: "cloud-sun" };
  } else if (code === 3) {
    return { text: "Overcast", icon: "overcast" };
  } else if (code === 45 || code === 48) {
    return { text: "Foggy", icon: "overcast" };
  } else if ([51, 53, 55, 56, 57, 61, 80].includes(code)) {
    return { text: "Light Rain", icon: "light-rain" };
  } else if ([63, 65, 66, 67, 81, 82].includes(code)) {
    return { text: "Heavy Rain", icon: "heavy-rain" };
  } else if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return { text: "Snow", icon: "snow" };
  } else if ([95, 96, 99].includes(code)) {
    return { text: "Thunderstorm", icon: "storm" };
  }
  return { text: "Clear", icon: "sunny" };
}

export default function WeatherIcon({ code, className = "", isMain = false }) {
  const { icon } = getWeatherDetails(code);

  if (isMain) {
    // ── Large icons for Left Panel & Mobile Hero ────────────────
    switch (icon) {
      case "sunny":
        return (
          <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Rays rotate around center 32,32 */}
            <g className="icon-sun-ray" style={{ transformOrigin: "32px 32px" }}>
              <line x1="32" y1="4"  x2="32" y2="14" stroke="var(--accent-ice)" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="32" y1="50" x2="32" y2="60" stroke="var(--accent-ice)" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="4"  y1="32" x2="14" y2="32" stroke="var(--accent-ice)" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="50" y1="32" x2="60" y2="32" stroke="var(--accent-ice)" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="11.5" y1="11.5" x2="18.5" y2="18.5" stroke="var(--accent-ice)" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="45.5" y1="45.5" x2="52.5" y2="52.5" stroke="var(--accent-ice)" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="52.5" y1="11.5" x2="45.5" y2="18.5" stroke="var(--accent-ice)" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="18.5" y1="45.5" x2="11.5" y2="52.5" stroke="var(--accent-ice)" strokeWidth="2.5" strokeLinecap="round"/>
            </g>
            <circle cx="32" cy="32" r="12" stroke="var(--accent-ice)" strokeWidth="2.5" fill="none"/>
          </svg>
        );

      case "cloud-sun":
        return (
          <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Smaller sun at 22,20 — rays rotate around that point */}
            <g className="icon-sun-ray" style={{ transformOrigin: "22px 20px" }}>
              <line x1="22" y1="5"  x2="22" y2="12" stroke="var(--accent-ice)" strokeWidth="2" strokeLinecap="round"/>
              <line x1="22" y1="28" x2="22" y2="35" stroke="var(--accent-ice)" strokeWidth="2" strokeLinecap="round"/>
              <line x1="5"  y1="20" x2="12" y2="20" stroke="var(--accent-ice)" strokeWidth="2" strokeLinecap="round"/>
              <line x1="32" y1="20" x2="39" y2="20" stroke="var(--accent-ice)" strokeWidth="2" strokeLinecap="round"/>
              <line x1="9.5"  y1="8.5"  x2="14.5" y2="13.5" stroke="var(--accent-ice)" strokeWidth="2" strokeLinecap="round"/>
              <line x1="29.5" y1="26.5" x2="34.5" y2="31.5" stroke="var(--accent-ice)" strokeWidth="2" strokeLinecap="round"/>
              <line x1="34.5" y1="8.5"  x2="29.5" y2="13.5" stroke="var(--accent-ice)" strokeWidth="2" strokeLinecap="round"/>
              <line x1="9.5"  y1="31.5" x2="14.5" y2="26.5" stroke="var(--accent-ice)" strokeWidth="2" strokeLinecap="round"/>
            </g>
            <circle cx="22" cy="20" r="9" stroke="var(--accent-ice)" strokeWidth="2" fill="none"/>
            {/* Cloud drifting in front */}
            <g className="icon-cloud">
              <path d="M30 44 Q34 37 43 39 Q52 41 52 50 Q52 58 43 58 L24 58 Q16 58 16 50 Q16 44 24 44 Q27 43 30 44Z"
                    fill="var(--glass-fill)" stroke="var(--glass-border-hi)" strokeWidth="1.5"/>
            </g>
          </svg>
        );

      case "overcast":
        return (
          <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g className="icon-cloud" style={{ animationDelay: "0.5s" }}>
              <path d="M20 34 Q24 26 34 28 Q44 30 44 40 Q44 50 34 50 L18 50 Q10 50 10 40 Q10 34 18 34Z"
                    fill="var(--glass-fill)" stroke="var(--glass-border-hi)" strokeWidth="1.5"/>
            </g>
            <g className="icon-cloud">
              <path d="M30 44 Q34 37 43 39 Q53 41 53 50 Q53 58 43 58 L24 58 Q16 58 16 50 Q16 44 24 44 Q27 43 30 44Z"
                    fill="var(--glass-fill)" stroke="var(--glass-border-hi)" strokeWidth="1.5"/>
            </g>
          </svg>
        );

      case "light-rain":
        return (
          <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g className="icon-cloud">
              <path d="M30 36 Q34 29 43 31 Q53 33 53 42 Q53 50 43 50 L24 50 Q16 50 16 42 Q16 36 24 36Z"
                    fill="var(--glass-fill)" stroke="var(--glass-border-hi)" strokeWidth="1.5"/>
            </g>
            <line className="icon-rain-drop" x1="24" y1="53" x2="22" y2="59" stroke="var(--accent-ice)" strokeWidth="2" strokeLinecap="round"/>
            <line className="icon-rain-drop" x1="34" y1="53" x2="32" y2="59" stroke="var(--accent-ice)" strokeWidth="2" strokeLinecap="round"/>
            <line className="icon-rain-drop" x1="44" y1="53" x2="42" y2="59" stroke="var(--accent-ice)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );

      case "heavy-rain":
        return (
          <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g className="icon-cloud">
              <path d="M30 34 Q34 27 43 29 Q53 31 53 40 Q53 48 43 48 L24 48 Q16 48 16 40 Q16 34 24 34Z"
                    fill="var(--glass-fill)" stroke="var(--glass-border-hi)" strokeWidth="1.5"/>
            </g>
            <line className="icon-rain-drop" x1="20" y1="51" x2="17" y2="58" stroke="var(--accent-ice)" strokeWidth="2.2" strokeLinecap="round"/>
            <line className="icon-rain-drop" x1="30" y1="51" x2="27" y2="58" stroke="var(--accent-ice)" strokeWidth="2.2" strokeLinecap="round"/>
            <line className="icon-rain-drop" x1="40" y1="51" x2="37" y2="58" stroke="var(--accent-ice)" strokeWidth="2.2" strokeLinecap="round"/>
            <line className="icon-rain-drop" x1="50" y1="51" x2="47" y2="58" stroke="var(--accent-ice)" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        );

      case "snow":
        return (
          <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g className="icon-cloud">
              <path d="M30 36 Q34 29 43 31 Q53 33 53 42 Q53 50 43 50 L24 50 Q16 50 16 42 Q16 36 24 36Z"
                    fill="var(--glass-fill)" stroke="var(--glass-border-hi)" strokeWidth="1.5"/>
            </g>
            {/* Animated snowflakes */}
            <circle className="icon-snowflake" cx="24" cy="56" r="2.5" fill="var(--accent-ice)" opacity="0.9"/>
            <circle className="icon-snowflake" cx="35" cy="58" r="2.5" fill="var(--accent-ice)" opacity="0.9"/>
            <circle className="icon-snowflake" cx="46" cy="56" r="2.5" fill="var(--accent-ice)" opacity="0.9"/>
          </svg>
        );

      case "storm":
        return (
          <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g className="icon-cloud">
              <path d="M30 34 Q34 27 43 29 Q53 31 53 40 Q53 48 43 48 L24 48 Q16 48 16 40 Q16 34 24 34Z"
                    fill="var(--glass-fill)" stroke="var(--glass-border-hi)" strokeWidth="1.5"/>
            </g>
            {/* Animated lightning bolt */}
            <polyline className="icon-lightning"
              points="35 47 30 54 37 54 32 62"
              stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        );

      default:
        return null;
    }
  }

  // ── Small / Forecast icons ──────────────────────────────────────
  switch (icon) {
    case "sunny":
      return (
        <svg className={`fc-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <line x1="12" y1="2"  x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/>
          <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/>
          <line x1="2"  y1="12" x2="4"  y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>
          <line x1="4.93" y1="19.07" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.07" y2="4.93"/>
        </svg>
      );

    case "cloud-sun":
      return (
        <svg className={`fc-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="9" r="3.5"/>
          <path d="M13 16a5 5 0 0 1 0-8"/>
          <path d="M14 20a4 4 0 1 0 0-8H5a3 3 0 1 0 0 6"/>
        </svg>
      );

    case "overcast":
      return (
        <svg className={`fc-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 18H7a5 5 0 0 1-1-10 5 5 0 0 1 9.9-1A4 4 0 1 1 17 18Z"/>
        </svg>
      );

    case "light-rain":
      return (
        <svg className={`fc-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
          <line x1="8" y1="19" x2="8" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="19"/>
        </svg>
      );

    case "heavy-rain":
      return (
        <svg className={`fc-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
          <line x1="8"  y1="19" x2="8"  y2="21"/>
          <line x1="12" y1="17" x2="12" y2="19"/>
          <line x1="16" y1="19" x2="16" y2="21"/>
        </svg>
      );

    case "snow":
      return (
        <svg className={`fc-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 18H7a5 5 0 0 1-1-10 5 5 0 0 1 9.9-1A4 4 0 1 1 17 18Z"/>
          <circle cx="8"  cy="21" r="0.8" fill="currentColor"/>
          <circle cx="12" cy="21" r="0.8" fill="currentColor"/>
          <circle cx="16" cy="21" r="0.8" fill="currentColor"/>
        </svg>
      );

    case "storm":
      return (
        <svg className={`fc-icon storm ${className}`} viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 18H7a5 5 0 0 1-1-10 5 5 0 0 1 9.9-1A4 4 0 1 1 17 18Z" stroke="currentColor"/>
          <polyline points="13 11 11 15 14 15 12 19" stroke="#F59E0B" strokeWidth="1.8"/>
        </svg>
      );

    default:
      return null;
  }
}
