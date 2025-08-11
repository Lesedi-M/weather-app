import React from "react";
import { WeatherData } from "./types";
import WeatherIcon from "./WeatherIcon";

interface HourlyForecastCardProps {
  weatherData: WeatherData;
  isDarkMode: boolean;
}

const HourlyForecastCard: React.FC<HourlyForecastCardProps> = ({
  weatherData,
  isDarkMode,
}) => {
  const gradientColors = [
    "linear-gradient(135deg, #FF8A65 0%, #FFB74D 100%)",
    "linear-gradient(135deg, #FFB74D 0%, #FFA726 100%)",
    "linear-gradient(135deg, #81C784 0%, #66BB6A 100%)",
    "linear-gradient(135deg, #64B5F6 0%, #5C6BC0 100%)",
    "linear-gradient(135deg, #5C6BC0 0%, #3F51B5 100%)",
  ];

  return (
    <div
      className="relative rounded-3xl p-8 shadow-2xl backdrop-blur-sm transition-all duration-300 mt-5"
      style={{
        background: isDarkMode
          ? "linear-gradient(110.05deg, #383838 0%, rgba(158, 158, 158, 0) 71.82%)"
          : "linear-gradient(110.05deg, #f0f0f0 0%, rgba(255, 255, 255, 0.8) 71.82%)",
        boxShadow: isDarkMode
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
          : "0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
      }}
    >
      <h3
        className="mb-8"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 700,
          fontSize: "32px",
          lineHeight: "100%",
          letterSpacing: "0%",
        }}
      >
        Hourly Forecast:
      </h3>
      <div className="grid grid-cols-5 gap-3">
        {weatherData.hourly.map((hour, index) => (
          <div
            key={index}
            className="text-center p-4 rounded-2xl transition-all duration-200 relative overflow-hidden"
            style={{
              background: isDarkMode
                ? "linear-gradient(135deg, rgba(55, 55, 55, 0.8) 0%, rgba(25, 25, 25, 0.9) 100%)"
                : gradientColors[index % gradientColors.length],
              backdropFilter: "blur(10px)",
              border: isDarkMode
                ? "1px solid rgba(255, 255, 255, 0.1)"
                : "1px solid rgba(255, 255, 255, 0.3)",
              color: isDarkMode ? "white" : "white",
              textShadow: isDarkMode ? "none" : "0 1px 2px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div className="relative z-10">
              <div
                className="text-sm font-semibold mb-3"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {hour.time}
              </div>
              <div className="flex justify-center mb-3 w-8 h-8 mx-auto">
                <WeatherIcon condition={hour.condition} size="small" />
              </div>
              <div
                className="font-bold text-lg mb-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {hour.temp}°C
              </div>
              <div className="text-xs flex items-center justify-center gap-1">
                <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-b-[6px] border-transparent border-b-cyan-300"></div>
                {hour.windSpeed}km/h
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecastCard;
